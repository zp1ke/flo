package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.api.utils.RequestUtils;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "user", description = "User management")
public class UserController {

    private final UserService userService;

    @Autowired(required = false)
    private HttpServletRequest httpRequest;

    @GetMapping("/me")
    @Operation(summary = "Get current user")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User user) {
        var dto = UserDto.fromUser(user);
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
}