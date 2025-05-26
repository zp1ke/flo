package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserToken;
import com.zp1ke.flo.data.repository.UserRepository;
import com.zp1ke.flo.data.repository.UserTokenRepository;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final Validator validator;

    private final UserRepository userRepository;

    private final UserTokenRepository userTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final ProfileService profileService;

    private final SettingService settingService;

    @Nullable
    public User findByUsernameAndValidToken(@NonNull String username,
                                            @NonNull String token,
                                            @NonNull String remoteAddress) {
        var user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            var userToken = userTokenRepository.findByTokenAndUserAndRemoteAddress(token, user.get(), remoteAddress);
            if (userToken.isPresent() && userToken.get().isValid()) {
                return user.get();
            }
        }
        return null;
    }

    @NonNull
    public User create(@NonNull User user) {
        user.generateUsernameIfMissing();

        var violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("user.invalid", violations);
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("user.username_already_exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("user.email_already_exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        var saved = userRepository.save(user);

        profileService.save(Profile.fromUser(saved));
        settingService.saveDefaultSettings(saved);

        return saved;
    }

    @Nullable
    public User findByEmailOrUsername(@Nullable String emailOrUsername) {
        if (StringUtils.isBlank(emailOrUsername)) {
            return null;
        }

        var byEmailOrUsername = userRepository.findByEmail(emailOrUsername);
        if (byEmailOrUsername.isEmpty()) {
            byEmailOrUsername = userRepository.findByUsername(emailOrUsername);
        }
        return byEmailOrUsername.orElse(null);
    }

    @Nullable
    public User findByEmailOrUsernameAndMatchingPassword(@Nullable String emailOrUsername, @Nullable String password) {
        if (StringUtils.isBlank(emailOrUsername) || StringUtils.isBlank(password)) {
            return null;
        }

        var byEmailOrUsername = userRepository.findByEmail(emailOrUsername);
        if (byEmailOrUsername.isEmpty()) {
            byEmailOrUsername = userRepository.findByUsername(emailOrUsername);
        }
        if (byEmailOrUsername.isEmpty()) {
            return null;
        }

        var user = byEmailOrUsername.get();
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public void saveUserToken(@NonNull User user,
                              @NonNull String token,
                              @NonNull String remoteAddress,
                              @NonNull OffsetDateTime expiresAt) {
        var userToken = userTokenRepository
            .findByTokenAndUser(token, user).orElse(new UserToken()).toBuilder()
            .user(user)
            .token(token)
            .remoteAddress(remoteAddress)
            .expiresAt(expiresAt)
            .build();
        userTokenRepository.save(userToken);
    }

    public void disableUserToken(@NonNull String token,
                                 @NonNull String remoteAddress) {
        userTokenRepository.deleteByTokenAndRemoteAddress(token, remoteAddress);
    }
}