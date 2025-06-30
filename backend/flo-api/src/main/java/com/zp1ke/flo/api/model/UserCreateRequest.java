package com.zp1ke.flo.api.model;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;

public record UserCreateRequest(@NotBlank(message = "user.invalid-email") String email,
                                @NotBlank(message = "user.invalid-name") String name,
                                @NotBlank(message = "user.password-empty") String password) {

    @Nonnull
    public User toUser() {
        return User.builder()
            .email(email)
            .username(email.split("@")[0])
            .password(password)
            .build();
    }

    @Nonnull
    public Profile toProfile() {
        return Profile.builder()
            .name(name)
            .build();
    }
}
