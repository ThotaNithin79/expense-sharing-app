package com.roomshare.service;

import com.roomshare.config.JwtUtil;
import com.roomshare.dto.AuthResponse;
import com.roomshare.dto.LoginRequest;
import com.roomshare.dto.SignupRequest;
import com.roomshare.dto.VerifyOtpRequest;
import com.roomshare.entity.User;
import com.roomshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;


import com.roomshare.dto.ForgotPasswordRequest;
import java.sql.Timestamp;
import java.util.UUID;

import com.roomshare.dto.ResetPasswordRequest;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService; // Correctly injected here
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    // In-memory cache to store OTPs and user details temporarily.
    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();

    // A simple private record to hold cached data.
    private record OtpData(String otp, SignupRequest signupRequest) {}

    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email address is already in use.");
        }

        String otp = generateOtp();

        otpCache.put(request.getEmail(), new OtpData(otp, request));

        // For testing purposes, we log the OTP to the console.
        logger.info("Generated OTP for {}: {}", request.getEmail(), otp);

        String emailBody = "Welcome to Expense Sharing App!\n\n" +
                "Your One-Time Password (OTP) for account verification is: " + otp + "\n\n" +
                "This code is valid for 10 minutes.";
        emailService.sendSimpleMessage(request.getEmail(), "Verify Your Account", emailBody);
    }

    public void verifyOtpAndCreateUser(VerifyOtpRequest request) {
        OtpData cachedData = otpCache.get(request.getEmail());

        if (cachedData == null) {
            throw new IllegalStateException("OTP expired or invalid email. Please sign up again.");
        }

        if (!cachedData.otp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Incorrect OTP provided.");
        }

        SignupRequest signupData = cachedData.signupRequest();
        User user = new User();
        user.setName(signupData.getName());
        user.setEmail(signupData.getEmail());
        user.setPassword(passwordEncoder.encode(signupData.getPassword()));
        user.setEnabled(true); // Enable the user's account

        userRepository.save(user);

        // Clean up the cache
        otpCache.remove(request.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        String jwtToken = jwtUtil.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    private String generateOtp() {
        Random random = new Random();
        int otpNumber = 100000 + random.nextInt(900000);
        return String.valueOf(otpNumber);
    }


    // ==== HANDLE FORGOT PASSWORD =====
    public void handleForgotPassword(ForgotPasswordRequest request) {
        // 1. Find the user by their email address.
        // We use .orElse(null) to avoid throwing an exception, as we don't want to reveal
        // to a potential attacker whether an email address is registered or not.
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Security Best Practice: Even if the user is not found, we don't throw an error.
        // We act as if an email was sent to prevent "email enumeration" attacks.
        if (user == null) {
            logger.warn("Password reset attempted for non-existent email: {}", request.getEmail());
            // Simply return without doing anything.
            return;
        }

        // 2. Generate a unique, random reset token.
        String token = UUID.randomUUID().toString();

        // 3. Set the token's expiry time (e.g., 15 minutes from now).
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000); // 15 minutes in milliseconds
        Timestamp expiryTimestamp = new Timestamp(expiryTime);

        // 4. Save the token and its expiry time to the user's record in the database.
        user.setResetPasswordToken(token);
        user.setResetTokenExpiry(expiryTimestamp);
        userRepository.save(user);

        // 5. Create the password reset link.
        // NOTE: In a real frontend application, this URL would point to your React app's reset password page.
        // For our backend-only testing, this is just a placeholder.
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        // 6. Send the email to the user.
        String emailBody = "Hello " + user.getName() + ",\n\n" +
                "You have requested to reset your password. Please click the link below to proceed:\n" +
                resetLink + "\n\n" +
                "If you did not request this, please ignore this email.\n" +
                "This link will expire in 15 minutes.";

        emailService.sendSimpleMessage(user.getEmail(), "Password Reset Request", emailBody);

        logger.info("Password reset token generated and email sent for user: {}", user.getEmail());
    }


    // ===== RESET PASSWORD =====
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // 1. Find the user by the provided reset token.
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token."));

        // 2. Security Check: Verify that the token has not expired.
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().before(now)) {
            // Invalidate the token to prevent reuse, even if it's already expired
            user.setResetPasswordToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new IllegalStateException("Password reset token has expired.");
        }

        // 3. Token is valid. Proceed to update the password.
        // Hash the new password before saving.
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newHashedPassword);

        // 4. Invalidate the token by setting it to null so it cannot be used again.
        user.setResetPasswordToken(null);
        user.setResetTokenExpiry(null);

        // 5. Save the updated user record to the database.
        userRepository.save(user);

        logger.info("Password successfully reset for user: {}", user.getEmail());

        // Optional: Send a confirmation email to the user.
        String emailBody = "Hello " + user.getName() + ",\n\n" +
                "This is a confirmation that the password for your account has just been changed.\n\n" +
                "If you did not make this change, please contact our support team immediately.";
        emailService.sendSimpleMessage(user.getEmail(), "Your Password Has Been Reset", emailBody);
    }

}