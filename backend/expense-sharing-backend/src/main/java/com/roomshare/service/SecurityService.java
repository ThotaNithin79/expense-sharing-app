package com.roomshare.service;

import com.roomshare.entity.GroupMember;
import com.roomshare.entity.User;
import com.roomshare.repository.GroupMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final GroupMemberRepository groupMemberRepository;

    /**
     * Checks if a user is a member of a specific group.
     * Throws AccessDeniedException if they are not.
     * @param groupId The ID of the group to check.
     * @param user The currently authenticated user.
     */
    public void verifyUserIsMemberOfGroup(Long groupId, User user) {
        if (!groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId()).isPresent()) {
            throw new AccessDeniedException("Access Denied: You are not a member of this group.");
        }
    }

    /**
     * Checks if a user is an ADMIN of a specific group.
     * Throws AccessDeniedException if they are not.
     * @param groupId The ID of the group to check.
     * @param user The currently authenticated user.
     */
    public void verifyUserIsAdminOfGroup(Long groupId, User user) {
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("Access Denied: You are not a member of this group."));

        if (member.getRole() != GroupMember.Role.ADMIN) {
            throw new AccessDeniedException("Access Denied: This action requires admin privileges.");
        }
    }
}