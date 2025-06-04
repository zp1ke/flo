package com.zp1ke.flo.api.model;

import jakarta.validation.constraints.NotBlank;

public record EmailRequest(@NotBlank(message = "user.invalid-email") String email) {
}
