package com.zp1ke.flo.utils;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StringUtilsTests {

    @Test
    void isNotBlank_returnsFalse_whenStringIsNull() {
        assertFalse(StringUtils.isNotBlank(null));
    }

    @Test
    void isNotBlank_returnsFalse_whenStringIsEmpty() {
        assertFalse(StringUtils.isNotBlank(""));
    }

    @Test
    void isNotBlank_returnsFalse_whenStringIsOnlyWhitespace() {
        assertFalse(StringUtils.isNotBlank("   "));
    }

    @Test
    void isNotBlank_returnsTrue_whenStringHasNonWhitespaceCharacters() {
        assertTrue(StringUtils.isNotBlank("hello"));
    }

    @Test
    void isNotBlank_returnsTrue_whenStringHasLeadingAndTrailingWhitespace() {
        assertTrue(StringUtils.isNotBlank("  hello  "));
    }

    @Test
    void generateRandomCode_throwsException_whenLengthIsZero() {
        assertThrows(IllegalArgumentException.class, () -> StringUtils.generateRandomCode(0));
    }

    @Test
    void generateRandomCode_throwsException_whenLengthIsNegative() {
        assertThrows(IllegalArgumentException.class, () -> StringUtils.generateRandomCode(-1));
    }

    @Test
    void generateRandomCode_returnsCodeOfSpecifiedLength_whenLengthIsPositive() {
        int length = 10;
        String code = StringUtils.generateRandomCode(length);
        assertEquals(code.length(), length);
    }

    @Test
    void generateRandomCode_containsOnlyLettersAndDigits() {
        String code = StringUtils.generateRandomCode(12);
        assertTrue(code.matches("[A-Z0-9]+"));
    }

    @Test
    void generateRandomCode_containsCorrectProportionOfLettersAndDigits_whenLengthIsEven() {
        String code = StringUtils.generateRandomCode(8);
        long letterCount = code.chars().filter(Character::isLetter).count();
        long digitCount = code.chars().filter(Character::isDigit).count();
        assertTrue(letterCount == 4 && digitCount == 4);
    }

    @Test
    void generateRandomCode_containsCorrectProportionOfLettersAndDigits_whenLengthIsOdd() {
        String code = StringUtils.generateRandomCode(7);
        long letterCount = code.chars().filter(Character::isLetter).count();
        long digitCount = code.chars().filter(Character::isDigit).count();
        assertTrue(letterCount == 4 && digitCount == 3);
    }
}
