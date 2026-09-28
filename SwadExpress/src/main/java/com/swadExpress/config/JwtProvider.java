package com.swadExpress.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {

    private SecretKey key= Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET_KEY.getBytes());

    public String generateToken(Authentication authentication) {

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles= populateAuthorities(authorities);

        String jwt=Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+86400000))
                .claim("email",authentication.getName())
                .claim("authorities",roles)
                .signWith(key)
                .compact();
        return jwt;

    }

    public String getEmailFromJwtToken(String jwt) {

        jwt=jwt.substring(7);
        Claims claims= Jwts.parser()
                .verifyWith(key)
                .build()
                .parseClaimsJws(jwt)
                .getPayload();

        return claims.get("email", String.class);

    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths= new HashSet<>();

        for(GrantedAuthority authority:authorities){
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }

}
