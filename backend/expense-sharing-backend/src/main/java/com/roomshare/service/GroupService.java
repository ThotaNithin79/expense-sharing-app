package com.roomshare.service;

import com.roomshare.dto.*;
import com.roomshare.entity.Group;
import com.roomshare.entity.GroupMember;
import com.roomshare.entity.User;
import com.roomshare.exception.ResourceNotFoundException;
import com.roomshare.repository.GroupMemberRepository;
import com.roomshare.repository.GroupRepository;
import com.roomshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(GroupService.class);
    private final SecurityService securityService;


    // ===== THIS METHOD IS NOW UPDATED to return the safe DTO =====
    @Transactional
    public GroupResponseDto createGroup(GroupRequest request, User creator) {
        Group group = new Group();
        group.setName(request.getName());
        group.setCreatedBy(creator);

        // Save the group to the database to get its ID and createdAt timestamp
        Group savedGroup = groupRepository.save(group);

        // Automatically add the creator as the first member with ADMIN role
        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(savedGroup);
        groupMember.setUser(creator);
        groupMember.setRole(GroupMember.Role.ADMIN);
        groupMemberRepository.save(groupMember);

        // ** THE FIX: Build and return the safe DTO instead of the raw entity **
        return new GroupResponseDto(
                savedGroup.getId(),
                savedGroup.getName(),
                savedGroup.getCreatedBy().getId(),
                savedGroup.getCreatedBy().getName(), // Only includes the name, hiding the password
                savedGroup.getCreatedAt()        // This will be correctly populated
        );
    }

    // ===== ALL METHODS BELOW ARE FINAL AND CORRECT =====

    public Optional<GroupMember> addMember(Long groupId, AddMemberRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        securityService.verifyUserIsAdminOfGroup(groupId, currentUser);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));
        User userToAdd = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (groupMemberRepository.findByGroupIdAndUserId(groupId, userToAdd.getId()).isPresent()) {
            return Optional.empty();
        }

        GroupMember newMember = new GroupMember();
        newMember.setGroup(group);
        newMember.setUser(userToAdd);
        newMember.setRole(GroupMember.Role.MEMBER);

        return Optional.of(groupMemberRepository.save(newMember));
    }

    public List<GroupMemberDto> getGroupMembers(Long groupId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        securityService.verifyUserIsMemberOfGroup(groupId, currentUser);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        return members.stream()
                .map(member -> new GroupMemberDto(
                        member.getUser().getId(),
                        member.getUser().getName(),
                        member.getUser().getEmail(),
                        member.getRole()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long groupId, Long userIdToRemove, User currentUser) {
        logger.info("Attempting to remove user {} from group {} by user {}", userIdToRemove, groupId, currentUser.getEmail());

        securityService.verifyUserIsAdminOfGroup(groupId, currentUser);
        logger.info("Authorization successful. User {} is an admin.", currentUser.getEmail());

        GroupMember memberToRemove = groupMemberRepository.findByGroupIdAndUserId(groupId, userIdToRemove)
                .orElseThrow(() -> new ResourceNotFoundException("Member with ID " + userIdToRemove + " not found in group " + groupId));

        if (memberToRemove.getRole() == GroupMember.Role.ADMIN) {
            long adminCount = groupMemberRepository.findByGroupId(groupId).stream()
                    .filter(m -> m.getRole() == GroupMember.Role.ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new IllegalStateException("Cannot remove the only admin of the group.");
            }
        }

        groupMemberRepository.delete(memberToRemove);
        logger.info("Successfully removed member {} from group {}.", userIdToRemove, groupId);
    }

    public List<UserGroupDto> getGroupsForUser(User currentUser) {
        List<GroupMember> memberships = groupMemberRepository.findByUserId(currentUser.getId());
        return memberships.stream()
                .map(member -> new UserGroupDto(
                        member.getGroup().getId(),
                        member.getGroup().getName(),
                        member.getRole().toString()
                ))
                .collect(Collectors.toList());
    }
}