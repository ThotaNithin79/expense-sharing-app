package com.roomshare.controller;

import com.roomshare.dto.*;
import com.roomshare.entity.GroupMember;
import com.roomshare.entity.User;
import com.roomshare.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    // ===== THIS ENDPOINT HAS BEEN UPDATED to return the safe DTO =====
    @PostMapping
    public ResponseEntity<GroupResponseDto> createGroup(@RequestBody GroupRequest request, @AuthenticationPrincipal User currentUser) {
        // The service now returns the correct, safe GroupResponseDto.
        GroupResponseDto createdGroupDto = groupService.createGroup(request, currentUser);
        // We return the DTO, which does not contain any sensitive user data.
        return ResponseEntity.ok(createdGroupDto);
    }

    // ===== ALL METHODS BELOW ARE FINAL AND CORRECT =====

    @PostMapping("/{groupId}/members")
    public ResponseEntity<?> addMember(@PathVariable Long groupId, @RequestBody AddMemberRequest request) {
        Optional<GroupMember> newMemberOptional = groupService.addMember(groupId, request);

        if (newMemberOptional.isPresent()) {
            return new ResponseEntity<>(newMemberOptional.get(), HttpStatus.CREATED);
        } else {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "User is already a member of this group."));
        }
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberDto>> getGroupMembers(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Map<String, String>> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser
    ) {
        groupService.removeMember(groupId, userId, currentUser);
        return ResponseEntity.ok(Map.of("message", "Member removed successfully."));
    }
    @GetMapping("/my-groups")
    public ResponseEntity<List<UserGroupDto>> getGroupsForCurrentUser(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(groupService.getGroupsForUser(currentUser));
    }
}