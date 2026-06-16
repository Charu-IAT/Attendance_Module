package com.example.attendance_module.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.UserRepo;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    public void sendOtp(String email) {
        // 1. Verify user exists
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account registered with this email address."));

        // 2. Generate OTP
        int otpVal = 100000 + new SecureRandom().nextInt(900000);
        String otp = String.valueOf(otpVal);

        // 3. Store OTP in memory with 5 minutes expiry
        otpStorage.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));

        // 4. Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("charumathi@iattechnologies.com");
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Dear " + user.getUserName() + ",\n\n"
                + "You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:\n\n"
                + "OTP: " + otp + "\n\n"
                + "This OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\n"
                + "Best regards,\n"
                + "IATT Attendance System Team");

        try {
            mailSender.send(message);
            System.out.println("OTP email sent successfully to " + email);
        } catch (Exception e) {
            System.out.println("==================================================");
            System.out.println("WARNING: Failed to send OTP email via SMTP: " + e.getMessage());
            System.out.println("For development, copy the OTP below:");
            System.out.println("Email: " + email);
            System.out.println("Generated OTP: " + otp);
            System.out.println("==================================================");
            throw new RuntimeException("SMTP Error: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }
        if (otpData.isExpired()) {
            otpStorage.remove(email);
            return false;
        }
        return otpData.getOtp().equals(otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        // 1. Verify OTP first
        if (!verifyOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP.");
        }

        // 2. Find User
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        // 3. Encode new password and update user
        user.setUserPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        // 4. Clear OTP
        otpStorage.remove(email);
    }
}
