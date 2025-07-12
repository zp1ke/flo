package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.api.model.UserSaveRequest;
import com.zp1ke.flo.api.security.UserIsVerified;
import com.zp1ke.flo.api.utils.RequestUtils;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.NotificationType;
import com.zp1ke.flo.data.service.UserService;
import com.zp1ke.flo.tools.model.ExportFormat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "user", description = "User management")
public class UserController {

    private final UserService userService;

    @Autowired(required = false)
    private HttpServletRequest httpRequest;

    @GetMapping("/me")
    @Operation(summary = "Get session user")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User user) {
        var dto = UserDto.fromUser(user);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    @Operation(summary = "Update session user data")
    @UserIsVerified
    public ResponseEntity<UserDto> update(@AuthenticationPrincipal User user,
                                          @RequestBody UserSaveRequest request) {
        if (request.needsVerifyAndHasInvalidCode(user)) {
            throw new IllegalArgumentException("user.invalid_verification_code");
        }
        var saved = userService.save(request.toUser(user), request.password());
        var dto = UserDto.fromUser(saved);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/send-verification/{type}")
    @Operation(summary = "Send verification to session user")
    @UserIsVerified
    public ResponseEntity<Void> sendVerification(@AuthenticationPrincipal User user,
                                                 @PathVariable NotificationType type) {
        userService.sendVerification(user, type);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sign-out")
    @Operation(summary = "Sign out session user")
    public ResponseEntity<AuthResponse> signOut(Authentication auth) {
        if (auth != null && auth.getCredentials() instanceof String token) {
            userService.disableUserToken(token, RequestUtils.remoteAddress(httpRequest));
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/export/{format}")
    @Operation(summary = "Export session user data")
    @UserIsVerified
    public ResponseEntity<Void> export(@AuthenticationPrincipal User user,
                                       @PathVariable ExportFormat format) {
        userService.exportUserData(user, format);
        return ResponseEntity.noContent().build();
    }
}