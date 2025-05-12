package com.zp1ke.flo.api.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class UserDtoTests {

    @Test
    void getUsername_WhenUsernameIsNull_AndEmailIsNull_ShouldReturnNull() {
        var userDto = UserDto.builder()
            .email(null)
            .username(null)
            .build();
        assertNull(userDto.getUsername());
    }

    @Test
    void getUsername_WhenUsernameIsNull_AndEmailIsValid_ShouldReturnEmailPrefix() {
        var userDto = UserDto.builder()
            .email("john.doe@example.com")
            .username(null)
            .build();
        assertEquals("john.doe", userDto.getUsername());
    }

    @Test
    void getUsername_WhenUsernameIsProvided_ShouldReturnUsername() {
        var userDto = UserDto.builder()
            .email("john.doe@example.com")
            .username("johndoe")
            .build();
        assertEquals("johndoe", userDto.getUsername());
    }
}
