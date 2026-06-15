package com.example.attendance_module.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Model.BlacklistedToken;
import com.example.attendance_module.Repo.BlacklistedTokenRepository;

@Service
public class BlackListedTokenService {

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    public void blacklistToken(String token) {
        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setBlacklistedAt(LocalDateTime.now());

        blacklistedTokenRepository.save(blacklistedToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
}