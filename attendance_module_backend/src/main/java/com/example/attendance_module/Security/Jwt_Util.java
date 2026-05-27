package com.example.attendance_module.Security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class Jwt_Util {
    private final String SECRET_KEY="ibhanagiletalenttechnologiesibhanagiletalenttechnologies";
    private final long EXPIRATION=1000*60*60*24;
    private final SecretKey secretKey=Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    public String generateToken(String email, String role){
        return Jwts.builder()
                .setSubject(email)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION))
                .compact();
    }
    public Claims getClaims(String token){
        return Jwts.parserBuilder()
                   .setSigningKey(secretKey)
                   .build()
                   .parseClaimsJws(token)
                   .getBody();
    }
    
    public String extractEmail(String token){
        return getClaims(token).getSubject();
    }

    public String extractRole(String token){
        return getClaims(token).get("role",String.class);
    }

    public Boolean validateJwtToken(String token){
        try{
            getClaims(token);
            return true;

        }catch(JwtException | IllegalArgumentException e){
            return false;

        }

    }

}
