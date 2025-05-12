package com.zp1ke.flo.utils;

/**
 * Utility class providing common string operations.
 */
public class StringUtils {

    /**
     * Checks if a String is not blank.
     * <p>
     * A string is considered not blank if it is not null,
     * not empty, and does not consist solely of whitespace.
     * </p>
     *
     * @param str the String to check, may be null
     * @return true if the String is not empty and not null and not whitespace only
     */
    public static boolean isNotBlank(String str) {
        return str != null && !str.trim().isBlank();
    }

    /**
     * Checks if a String is blank.
     * <p>
     * A string is considered blank if it is null, empty,
     * or consists solely of whitespace characters.
     * </p>
     *
     * @param str the String to check, may be null
     * @return true if the String is empty or null or whitespace only
     */
    public static boolean isBlank(String str) {
        return str == null || str.trim().isBlank();
    }

    /**
     * Generates a random alphanumeric code of the specified length.
     * <p>
     * The code consists of uppercase letters and digits with the following pattern:
     * <ul>
     *   <li>First (length / 2) characters are uppercase letters (or (length / 2 + 1) if length is odd)</li>
     *   <li>Remaining characters are digits</li>
     * </ul>
     * </p>
     *
     * @param length the desired length of the code
     * @return a random alphanumeric code with the specified pattern
     * @throws IllegalArgumentException if length is less than or equal to 0
     */
    public static String generateRandomCode(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }

        var code = new StringBuilder(length);
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var digits = "0123456789";

        var letterCount = (length + 1) / 2; // First half (or half + 1 if odd)
        var digitCount = length / 2; // Second half

        for (int i = 0; i < letterCount; i++) {
            var index = (int) (Math.random() * letters.length());
            code.append(letters.charAt(index));
        }

        for (int i = 0; i < digitCount; i++) {
            var index = (int) (Math.random() * digits.length());
            code.append(digits.charAt(index));
        }

        return code.toString();
    }
}
