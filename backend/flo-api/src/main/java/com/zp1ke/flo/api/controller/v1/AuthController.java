package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.model.AuthRequest;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.api.security.JwtTokenProvider;
import com.zp1ke.flo.data.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "auth", description = "Authentication")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;

    private final UserService userService;

    @PostMapping("/sign-up")
    @Operation(summary = "Create a new user")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody UserDto request) {
        var user = userService.create(request.toUser());

        var token = jwtTokenProvider.generateToken(user.getUsername());
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

        var token = jwtTokenProvider.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, UserDto.fromUser(user)));
    }
}