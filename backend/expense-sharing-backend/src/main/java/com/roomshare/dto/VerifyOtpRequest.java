package com.roomshare.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object for the OTP verification request.
 * It contains the user's email and the OTP they submitted.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {

    private String email;

    private String otp;

}