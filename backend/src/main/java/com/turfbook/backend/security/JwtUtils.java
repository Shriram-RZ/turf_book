package com.turfbook.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            System.out.println("[JWT Validation] Attempting to validate token: "
                    + authToken.substring(0, Math.min(20, authToken.length())) + "...");
            System.out.println("[JWT Validation] Using secret key (first 10 chars): "
                    + jwtSecret.substring(0, Math.min(10, jwtSecret.length())) + "...");

            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            System.out.println("[JWT Validation] Token is VALID");
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("[JWT Validation] Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("[JWT Validation] JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("[JWT Validation] JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("[JWT Validation] JWT claims string is empty: " + e.getMessage());
        } catch (JwtException e) {
            System.err.println("[JWT Validation] JWT validation error: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }
}
