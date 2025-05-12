package com.zp1ke.flo.api.model;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(@NotBlank(message = "user.invalid-emailOrUsername") String username,
                          @NotBlank(message = "user.password-empty") String password) {
}
