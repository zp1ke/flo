package com.zp1ke.flo.api.model;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;

public record UserSaveRequest(@NotBlank(message = "user.invalid-verify-code") String verifyCode,
                              String email,
                              String password) {
    @Nonnull
    public User toUser(@Nonnull User user) {
        var userToUpdate = user.toBuilder();
        if (StringUtils.isNotBlank(email)) {
            userToUpdate.email(email);
        }
        return userToUpdate.build();
    }

    public boolean needsVerifyAndHasInvalidCode(@Nonnull User user) {
        return StringUtils.notMatch(email, user.getEmail()) &&
            StringUtils.notMatch(verifyCode, user.getVerifyCode());
    }
}
