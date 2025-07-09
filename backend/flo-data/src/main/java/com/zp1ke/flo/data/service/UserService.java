package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserToken;
import com.zp1ke.flo.data.model.ExportFormat;
import com.zp1ke.flo.data.model.NotificationType;
import com.zp1ke.flo.data.repository.UserRepository;
import com.zp1ke.flo.data.repository.UserTokenRepository;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.JobScheduler;
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

    private final NotificationService notificationService;

    private final JobScheduler jobScheduler;

    public User findByUsernameAndValidToken(@Nonnull String username,
                                            @Nonnull String token,
                                            @Nonnull String remoteAddress) {
        var user = userRepository.findByUsernameAndEnabledTrue(username);
        if (user.isPresent()) {
            var userToken = userTokenRepository.findByTokenAndUserAndRemoteAddress(token, user.get(), remoteAddress);
            if (userToken.isPresent() && userToken.get().isValid()) {
                return user.get();
            }
        }
        return null;
    }

    @Nonnull
    public User create(@Nonnull User user, @Nonnull Profile profile) {
        user.generateUsernameIfMissing();

        var violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("user.invalid", violations);
        }

        if (StringUtils.isNotEmail(user.getEmail())) {
            throw new IllegalArgumentException("user.invalid_email");
        }

        if (userRepository.existsByEmailAndEnabledTrue(user.getEmail())) {
            throw new IllegalArgumentException("user.email_already_exists");
        }

        if (userRepository.existsByUsernameAndEnabledTrue(user.getUsername())) {
            throw new IllegalArgumentException("user.username_already_exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerifyCode(StringUtils.generateRandomCode(6));
        var saved = userRepository.save(user);

        profile.setUser(saved);
        var savedProfile = profileService.save(profile);
        settingService.saveDefaultSettings(saved);

        sendVerification(saved, savedProfile, NotificationType.VERIFICATION_LINK);

        return saved;
    }

    @Nonnull
    public User save(@Nonnull User user, @Nullable String password) {
        var violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("user.invalid", violations);
        }

        if (StringUtils.isNotEmail(user.getEmail())) {
            throw new IllegalArgumentException("user.invalid_email");
        }

        if (userRepository.existsByEmailAndEnabledTrue(user.getEmail())) {
            throw new IllegalArgumentException("user.email_already_exists");
        }

        if (userRepository.existsByUsernameAndEnabledTrue(user.getUsername())) {
            throw new IllegalArgumentException("user.username_already_exists");
        }

        if (StringUtils.isNotBlank(password)) {
            user.setPassword(passwordEncoder.encode(password));
        }

        return userRepository.save(user);
    }

    public User findByEmailOrUsername(String emailOrUsername) {
        if (StringUtils.isBlank(emailOrUsername)) {
            return null;
        }

        var byEmailOrUsername = userRepository.findByEmailAndEnabledTrue(emailOrUsername);
        if (byEmailOrUsername.isEmpty()) {
            byEmailOrUsername = userRepository.findByUsernameAndEnabledTrue(emailOrUsername);
        }
        return byEmailOrUsername.orElse(null);
    }

    public User findByEmailOrUsernameAndMatchingPassword(String emailOrUsername, String password) {
        if (StringUtils.isBlank(emailOrUsername) || StringUtils.isBlank(password)) {
            return null;
        }

        var byEmailOrUsername = userRepository.findByEmailAndEnabledTrue(emailOrUsername);
        if (byEmailOrUsername.isEmpty()) {
            byEmailOrUsername = userRepository.findByUsernameAndEnabledTrue(emailOrUsername);
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

    public void saveUserToken(@Nonnull User user,
                              @Nonnull String token,
                              @Nonnull String remoteAddress,
                              @Nonnull OffsetDateTime expiresAt) {
        var userToken = userTokenRepository
            .findByTokenAndUser(token, user).orElse(new UserToken()).toBuilder()
            .user(user)
            .token(token)
            .remoteAddress(remoteAddress)
            .expiresAt(expiresAt)
            .build();
        userTokenRepository.save(userToken);
    }

    @Transactional
    public void disableUserToken(@Nonnull String token,
                                 @Nonnull String remoteAddress) {
        userTokenRepository.deleteByTokenAndRemoteAddress(token, remoteAddress);
    }

    public void verifyUserByCode(@Nonnull String code) {
        var userByCode = userRepository.findByVerifyCodeAndEnabledTrue(code);
        if (userByCode.isEmpty()) {
            throw new IllegalArgumentException("user.verify_code_not_found");
        }

        var user = userByCode.get();
        user.setVerifyCode(null);
        user.setVerifiedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    public void sendRecoveryEmail(@Nonnull String email) {
        var userByEmail = userRepository.findByEmailAndEnabledTrue(email);
        if (userByEmail.isPresent()) {
            var user = userByEmail.get();
            user.setVerifyCode(StringUtils.generateRandomCode(6));
            var saved = userRepository.save(user);

            profileService.firstProfileOfUser(saved)
                .ifPresent(profile -> jobScheduler.enqueue(
                    () -> notificationService.sendRecoveryLink(user, profile)));
        }
    }

    public void recoverUser(@Nonnull String code,
                            @Nonnull String username,
                            @Nonnull String password) {
        var userByCode = userRepository.findByVerifyCodeAndEnabledTrue(code);
        if (userByCode.isEmpty()) {
            throw new IllegalArgumentException("user.verify_code_not_found");
        }

        var user = userByCode.get();
        if (!user.getEmail().equals(username) && !user.getUsername().equals(username)) {
            throw new IllegalArgumentException("user.email_does_not_match");
        }

        user.setVerifyCode(null);
        user.setVerifiedAt(OffsetDateTime.now());
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Nonnull
    public User sendVerification(@Nonnull User user, @Nonnull NotificationType notificationType) {
        var profile = profileService.firstProfileOfUser(user)
            .orElseThrow(() -> new IllegalArgumentException("user.profile_not_found"));

        user.setVerifyCode(StringUtils.generateRandomCode(6));
        var saved = userRepository.save(user);

        sendVerification(saved, profile, notificationType);
        return saved;
    }

    private void sendVerification(@Nonnull User user,
                                  @Nonnull Profile profile,
                                  @Nonnull NotificationType notificationType) {
        if (notificationType == NotificationType.VERIFICATION_LINK) {
            jobScheduler.enqueue(() -> notificationService.sendVerificationLink(user, profile));
        } else if (notificationType == NotificationType.VERIFICATION_CODE) {
            jobScheduler.enqueue(() -> notificationService.sendVerificationCode(user, profile));
        }
    }

    public void exportUserData(@Nonnull User user, @Nonnull ExportFormat format) {
        jobScheduler.enqueue(() -> exportData(user, format));
    }

    private void exportData(@Nonnull User user, @Nonnull ExportFormat format) {
        // TODO: Implement user data export logic based on the format
    }
}