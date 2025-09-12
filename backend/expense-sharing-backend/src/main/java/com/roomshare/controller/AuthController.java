package com.roomshare.controller;

import com.roomshare.dto.AuthResponse;
import com.roomshare.dto.LoginRequest;
import com.roomshare.dto.SignupRequest;
import com.roomshare.dto.VerifyOtpRequest;
import com.roomshare.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.roomshare.dto.ForgotPasswordRequest;

import java.util.Map;

import com.roomshare.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // The controller only needs to know about the AuthService.
    private final AuthService authService;
    // The EmailService injection is removed from here because it's a dependency of AuthService, not the controller.

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        // The new, correct response message.
        return ResponseEntity.ok(Map.of("message", "Verification OTP sent to your email address."));
    }

    // The new endpoint for OTP verification.
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtpAndCreateUser(request);
        return ResponseEntity.ok(Map.of("message", "User registered successfully. You can now log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ===== FORGOT PASSWORD =====
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.handleForgotPassword(request);
        // We always return a generic success message for security reasons.
        return ResponseEntity.ok(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
    }

    // ===== RESET PASSWORD =====
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Your password has been reset successfully."));
    }
}