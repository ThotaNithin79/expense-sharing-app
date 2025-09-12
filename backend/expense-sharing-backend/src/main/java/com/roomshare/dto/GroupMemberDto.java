package com.roomshare.dto;

import com.roomshare.entity.GroupMember;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDto {
    private Long userId;
    private String name;
    private String email;
    private GroupMember.Role role;
}