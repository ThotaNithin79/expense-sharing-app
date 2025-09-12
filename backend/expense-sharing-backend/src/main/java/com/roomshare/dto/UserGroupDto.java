package com.roomshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserGroupDto {
    private Long groupId;
    private String groupName;
    private String userRole;
}