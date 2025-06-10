package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {

    @Email(message = "user.email-invalid")
    @NotBlank(message = "user.email-invalid")
    private String email;

    @Size(min = 3, message = "user.username-size")
    private String username;

    @NotBlank(message = "user.password-empty")
    private String password;

    private boolean verified;

    @Nonnull
    public static UserDto fromUser(@Nonnull User user) {
        return UserDto.builder()
            .email(user.getEmail())
            .username(user.getUsername())
            .verified(user.isVerified())
            .build();
    }

    public String getUsername() {
        if (username == null && StringUtils.isNotBlank(email)) {
            return email.split("@")[0];
        }
        return username;
    }
}
