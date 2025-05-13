package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.ListDto;
import com.zp1ke.flo.api.dto.ProfileDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.UserProfile;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Tag(name = "profiles", description = "User profiles")
public class ProfileController {

    private final UserService userService;

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get profiles")
    public ResponseEntity<ListDto<ProfileDto>> getProfiles(@AuthenticationPrincipal User user) {
        var profiles = profileService.profilesOfUser(user).stream()
            .map(ProfileDto::fromProfile)
            .toList();
        return ResponseEntity.ok(new ListDto<>(profiles));
    }

    @PostMapping
    @Operation(summary = "Add profile data")
    public ResponseEntity<ListDto<ProfileDto>> addProfile(@AuthenticationPrincipal User user,
                                                          @RequestBody ProfileDto request) {
        var profile = request.toProfile();
        profile.setUser(user);
        profileService.save(profile);
        return getProfiles(user);
    }

    @PutMapping("/{code}")
    @Operation(summary = "Update profile data")
    public ResponseEntity<ListDto<ProfileDto>> updateProfile(@AuthenticationPrincipal UserProfile userProfile,
                                                             @RequestBody ProfileDto request) {
        if (userProfile.profile() != null) {
            var profileToUpdate = userProfile.profile().toBuilder()
                .name(request.getName())
                .build();
            profileService.save(profileToUpdate);
            return getProfiles(userProfile.user());
        }
        return ResponseEntity.notFound().build();
    }
}
