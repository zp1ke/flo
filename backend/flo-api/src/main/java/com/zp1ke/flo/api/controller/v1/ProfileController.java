package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.PageDto;
import com.zp1ke.flo.api.dto.ProfileDto;
import com.zp1ke.flo.api.security.UserIsVerified;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Tag(name = "profiles", description = "User profiles")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get profiles")
    public ResponseEntity<PageDto<ProfileDto>> getProfiles(@AuthenticationPrincipal User user,
                                                           @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC)
                                                           Pageable pageable,
                                                           @RequestParam(required = false, name = "name") String nameFilter) {
        var profiles = profileService.profilesOfUser(user, nameFilter, pageable);
        return ResponseEntity.ok(PageDto.of(profiles, ProfileDto::fromProfile));
    }

    @PostMapping
    @Operation(summary = "Add profile data")
    @UserIsVerified
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
    @UserIsVerified
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

    @DeleteMapping("/{profileCode}")
    @Operation(summary = "Delete profile data")
    @UserIsVerified
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal User user,
                                              @PathVariable String profileCode) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            profileService.delete(profile.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
