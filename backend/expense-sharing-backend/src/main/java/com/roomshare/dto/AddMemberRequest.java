package com.roomshare.dto;

import lombok.Data;

@Data
public class AddMemberRequest {
    private String email; // It's better to add members by email
}