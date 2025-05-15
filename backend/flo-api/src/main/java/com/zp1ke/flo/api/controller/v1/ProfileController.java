package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.ListDto;
import com.zp1ke.flo.api.dto.ProfileDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ProfileDto> addProfile(@AuthenticationPrincipal User user,
                                                 @RequestBody ProfileDto request) {
        var profile = request.toProfile();
        profile.setUser(user);
        var saved = profileService.save(profile);
        var dto = ProfileDto.fromProfile(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{profileCode}")
    @Operation(summary = "Update profile data")
    public ResponseEntity<ProfileDto> updateProfile(@AuthenticationPrincipal User user,
                                                    @PathVariable String profileCode,
                                                    @RequestBody ProfileDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var profileToUpdate = profile.get().toBuilder()
                .name(request.getName())
                .build();
            var saved = profileService.save(profileToUpdate);
            var dto = ProfileDto.fromProfile(saved);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }
}
