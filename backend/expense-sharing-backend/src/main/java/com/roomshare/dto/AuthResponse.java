package com.roomshare.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // We keep this for flexibility
public class AuthResponse {

    private String token;

    // FIX: Manually add the constructor that takes a String argument.
    // This is the constructor that AuthService is trying to call.
    public AuthResponse(String token) {
        this.token = token;
    }
}