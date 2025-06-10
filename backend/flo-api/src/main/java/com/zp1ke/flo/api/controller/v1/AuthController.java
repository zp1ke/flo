package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.model.AuthRequest;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.api.model.EmailRequest;
import com.zp1ke.flo.api.model.UserRequest;
import com.zp1ke.flo.api.security.JwtTokenProvider;
import com.zp1ke.flo.api.utils.RequestUtils;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.UserService;
import com.zp1ke.flo.utils.DateTimeUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "auth", description = "Authentication")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;

    private final UserService userService;

    @Autowired(required = false)
    private HttpServletRequest httpRequest;

    @PostMapping("/sign-up")
    @Operation(summary = "Create a new user")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody UserRequest request,
                                               Locale locale) {
        var profile = request.toProfile().toBuilder()
            .language(locale.toLanguageTag())
            .build();
        var user = userService.create(request.toUser(), profile);

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

    @PostMapping("/verify/{code}")
    @Operation(summary = "Verifies user")
    public ResponseEntity<Void> verify(@PathVariable String code) {
        userService.verifyUserByCode(code);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recover")
    @Operation(summary = "Send email with recovery code")
    public ResponseEntity<Void> recover(@Valid @RequestBody EmailRequest emailRequest) {
        userService.sendRecoveryEmail(emailRequest.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recovery/{code}")
    @Operation(summary = "Recover user by code")
    public ResponseEntity<Void> recovery(@PathVariable String code,
                                         @Valid @RequestBody AuthRequest authRequest) {
        userService.recoverUser(code, authRequest.username(), authRequest.password());
        return ResponseEntity.noContent().build();
    }

    @Nonnull
    private String generateToken(@Nonnull User user) {
        var remoteAddress = RequestUtils.remoteAddress(httpRequest);
        return generateToken(user, remoteAddress);
    }

    @Nonnull
    public String generateToken(@Nonnull User user, @Nonnull String remoteAddress) {
        var jwtToken = jwtTokenProvider.generateToken(user.getUsername());
        var expiresAt = DateTimeUtils.toOffsetDateTime(jwtToken.getExpirationDate());
        userService.saveUserToken(user, jwtToken.getToken(), remoteAddress, expiresAt);

        return jwtToken.getToken();
    }
}