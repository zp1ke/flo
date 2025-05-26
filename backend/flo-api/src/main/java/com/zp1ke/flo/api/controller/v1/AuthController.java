package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.ProfileDto;
import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.dto.UserWithProfilesDto;
import com.zp1ke.flo.api.model.AuthRequest;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.api.security.JwtTokenProvider;
import com.zp1ke.flo.api.utils.RequestUtils;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import com.zp1ke.flo.utils.DateTimeUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "auth", description = "Authentication")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;

    private final UserService userService;

    private final ProfileService profileService;

    @Autowired(required = false)
    private HttpServletRequest httpRequest;

    @PostMapping("/sign-up")
    @Operation(summary = "Create a new user")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody UserDto request) {
        var user = userService.create(request.toUser());

        var token = generateToken(user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new AuthResponse(token, UserDto.fromUser(user)));
    }

    @PostMapping("/sign-in")
    @Operation(summary = "Authenticate a user")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody AuthRequest authRequest) {
        var user = userService.findByEmailOrUsernameAndMatchingPassword(authRequest.username(), authRequest.password());
        if (user == null) {
            throw new BadCredentialsException("user.invalid_credentials");
        }

        var token = generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, UserDto.fromUser(user)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user with profiles")
    public ResponseEntity<UserWithProfilesDto> me(@AuthenticationPrincipal User user) {
        var profiles = profileService.profilesOfUser(user);
        var dto = UserWithProfilesDto.builder()
            .user(UserDto.fromUser(user))
            .profiles(profiles.stream().map(ProfileDto::fromProfile).toList())
            .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/sign-out")
    @Operation(summary = "Sign out session user")
    public ResponseEntity<AuthResponse> signOut(Authentication auth) {
        if (auth != null && auth.getCredentials() instanceof String token) {
            userService.disableUserToken(token, RequestUtils.remoteAddress(httpRequest));
        }
        return ResponseEntity.noContent().build();
    }

    @NonNull
    public String generateToken(@NonNull User user) {
        var remoteAddress = RequestUtils.remoteAddress(httpRequest);
        return generateToken(user, remoteAddress);
    }

    @NonNull
    public String generateToken(@NonNull User user, @NonNull String remoteAddress) {
        var jwtToken = jwtTokenProvider.generateToken(user.getUsername());
        var expiresAt = DateTimeUtils.toOffsetDateTime(jwtToken.getExpirationDate());
        userService.saveUserToken(user, jwtToken.getToken(), remoteAddress, expiresAt);

        return jwtToken.getToken();
    }
}