package com.zp1ke.flo.tools.model;

import jakarta.annotation.Nonnull;

public record FileContent(@Nonnull String name, @Nonnull byte[] content) {

    @Nonnull
    public String codeFor(@Nonnull String prefix) {
        var code = String.format("%s_%s", prefix, name);
        if (code.length() > 255) {
            var diff = code.length() - 255;
            var fileName = name.substring(diff);
            code = String.format("%s_%s", prefix, fileName);
        }
        return code;
    }
}
