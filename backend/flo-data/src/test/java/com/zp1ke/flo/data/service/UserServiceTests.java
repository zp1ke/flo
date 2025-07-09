package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.repository.UserRepository;
import com.zp1ke.flo.data.repository.UserTokenRepository;
import jakarta.annotation.Nonnull;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Optional;
import org.jobrunr.scheduling.JobScheduler;
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

    @Nonnull
    private static Profile profileFromUser(@Nonnull User user) {
        return Profile.builder()
            .user(user)
            .name(user.getUsername())
            .build();
    }

    private UserService createUserService(UserRepository userRepository) {
        return new UserService(validator, userRepository,
            mock(UserTokenRepository.class), mock(PasswordEncoder.class),
            mock(ProfileService.class), mock(SettingService.class),
            mock(NotificationService.class), mock(JobScheduler.class));
    }

    @Test
    void create_throwsException_whenEmailIsNull() {
        var user = User.builder().build();

        var userService = createUserService(mock(UserRepository.class));

        assertThrows(ConstraintViolationException.class, () -> userService.create(user, profileFromUser(user)));
    }

    @Test
    void create_throwsException_whenEmailIsBlank() {
        var user = User.builder()
            .email("   ")
            .build();

        var userService = createUserService(mock(UserRepository.class));

        assertThrows(ConstraintViolationException.class, () -> userService.create(user, profileFromUser(user)));
    }

    @Test
    void create_throwsException_whenEmailAlreadyExists() {
        var user = User.builder()
            .email("test@example.com")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmailAndEnabledTrue("test@example.com"))
            .thenReturn(Optional.of(User.builder().build()));

        var userService = createUserService(userRepository);

        assertThrows(ConstraintViolationException.class, () -> userService.create(user, profileFromUser(user)));
    }

    @Test
    void create_generatesUniqueCode_whenCodeAlreadyExists() {
        var user = User.builder()
            .email("test@example.com")
            .username("test")
            .password("password")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmailAndEnabledTrue("test@example.com"))
            .thenReturn(Optional.empty());
        when(userRepository.existsByUsernameAndEnabledTrue(anyString()))
            .thenReturn(false);
        when(userRepository.findByUsernameAndEnabledTrue(anyString()))
            .thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> {
                User savedUser = invocation.getArgument(0);
                savedUser.setUsername("uniqueCode");
                return savedUser;
            });

        var userService = createUserService(userRepository);

        var createdUser = userService.create(user, profileFromUser(user));
        assertNotNull(createdUser);
        assertNotNull(createdUser.getUsername());
        verify(userRepository).existsByUsernameAndEnabledTrue(anyString());
    }

    @Test
    void createUser_saves_whenValidEmailAndUniqueCode() {
        var user = User.builder()
            .email("test@example.com")
            .username("test")
            .password("password")
            .build();

        var userRepository = mock(UserRepository.class);
        when(userRepository.findByEmailAndEnabledTrue("test@example.com"))
            .thenReturn(Optional.empty());
        when(userRepository.existsByUsernameAndEnabledTrue(anyString()))
            .thenReturn(false);
        when(userRepository.findByUsernameAndEnabledTrue(anyString()))
            .thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        var userService = createUserService(userRepository);

        var createdUser = userService.create(user, profileFromUser(user));

        assertNotNull(createdUser.getUsername());
        verify(userRepository).save(user);
    }
}
