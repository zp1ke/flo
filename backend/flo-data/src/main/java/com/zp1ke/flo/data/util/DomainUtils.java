package com.zp1ke.flo.data.util;

import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import java.util.function.Function;

public class DomainUtils {
    /**
     * Generates a random unique code for a domain object.
     *
     * @param existsChecker A function that checks if the generated code already exists.
     * @return A unique random code.
     */
    @Nonnull
    public static String generateRandomCode(@Nonnull Function<String, Boolean> existsChecker) {
        String code;
        do {
            code = StringUtils.generateRandomCode(8);
        } while (existsChecker.apply(code));
        return code;
    }
}
