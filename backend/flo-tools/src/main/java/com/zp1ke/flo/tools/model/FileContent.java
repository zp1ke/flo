package com.zp1ke.flo.tools.model;

import jakarta.annotation.Nonnull;

public record FileContent(@Nonnull String name, @Nonnull byte[] content) {
}
