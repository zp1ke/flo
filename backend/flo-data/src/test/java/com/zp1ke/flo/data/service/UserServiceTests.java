package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.repository.UserRepository;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class UserServiceTests {
    private final Validator validator;

    UserServiceTests() {
        try (var validatorFactory = Validation.buildDefaultValidatorFactory()) {
            validator = validatorFactory.getValidator();
        }
    }

    private UserService createUserService(UserRepository userRepository) {
        return new UserService(validator, userRepository,
            mock(PasswordEncoder.class), mock(ProfileService.class),
            mock(SettingService.class));
    }

    @Test
    void create_throwsException_whenEmailIsNull() {
        var user = User.builder().build();

        var userService = createUserService(mock(UserRepository.class));

        assertThrows(ConstraintViolationException.class, () -> userService.create(user));
    }

    @Test
    void create_throwsException_whenEmailIsBlank() {
        var user = User.builder()
            .email("   ")
            .build();

        var userService = createUserService(mock(UserRepository.class));

        assertThrows(ConstraintViolationException.class, () -> userService.create(user));
    }

    @Test
    void create_throwsException_whenEmailAlreadyExists() {
        var user = User.builder()
            .email("test@example.com")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(User.builder().build()));

        var userService = createUserService(userRepository);

        assertThrows(ConstraintViolationException.class, () -> userService.create(user));
    }

    @Test
    void create_generatesUniqueCode_whenCodeAlreadyExists() {
        var user = User.builder()
            .email("test@example.com")
            .username("test")
            .password("password")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.empty());
        when(userRepository.existsByUsername(anyString()))
            .thenReturn(false);
        when(userRepository.findByUsername(anyString()))
            .thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> {
                User savedUser = invocation.getArgument(0);
                savedUser.setUsername("uniqueCode");
                return savedUser;
            });

        var userService = createUserService(userRepository);

        var createdUser = userService.create(user);
        assertNotNull(createdUser);
        assertNotNull(createdUser.getUsername());
        verify(userRepository).existsByUsername(anyString());
    }

    @Test
    void createUser_saves_whenValidEmailAndUniqueCode() {
        var user = User.builder()
            .email("test@example.com")
            .username("test")
            .password("password")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.empty());
        when(userRepository.existsByUsername(anyString()))
            .thenReturn(false);
        when(userRepository.findByUsername(anyString()))
            .thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        var userService = createUserService(userRepository);

        var createdUser = userService.create(user);

        assertNotNull(createdUser.getUsername());
        verify(userRepository).save(user);
    }
}
