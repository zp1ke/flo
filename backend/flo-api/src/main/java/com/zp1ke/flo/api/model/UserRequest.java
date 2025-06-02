package com.zp1ke.flo.api.model;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.lang.NonNull;

public record UserRequest(@NotBlank(message = "user.invalid-email") String email,
                          @NotBlank(message = "user.invalid-name") String name,
                          @NotBlank(message = "user.password-empty") String password) {

    @NonNull
    public User toUser() {
        return User.builder()
            .email(email)
            .username(email.split("@")[0])
            .password(password)
            .build();
    }

    @NonNull
    public Profile toProfile() {
        return Profile.builder()
            .name(name)
            .build();
    }
}
