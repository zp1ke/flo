package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Setting;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.SettingRepository;
import jakarta.annotation.Nonnull;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingService {

    private static final Short DEFAULT_USER_MAX_PROFILES = 2;

    private static final Short DEFAULT_USER_MAX_CATEGORIES = 5;

    private static final Short DEFAULT_USER_MAX_WALLETS = 3;

    private static final Short DEFAULT_USER_MAX_TRANSACTIONS_PER_DAY = 20;

    private static final Short DEFAULT_USER_MAX_EXPORTS_PER_MONTH = 1;

    private static final Short DEFAULT_USER_EXPORTS_FILES_DAYS_TO_LIVE = 7;

    private final SettingRepository settingRepository;

    public void saveDefaultSettings(@Nonnull User user) {
        var defaultSettings = Map.of(
            SettingCode.USER_MAX_PROFILES, DEFAULT_USER_MAX_PROFILES,
            SettingCode.USER_MAX_CATEGORIES, DEFAULT_USER_MAX_CATEGORIES,
            SettingCode.USER_MAX_WALLETS, DEFAULT_USER_MAX_WALLETS,
            SettingCode.USER_MAX_TRANSACTIONS_PER_DAY, DEFAULT_USER_MAX_TRANSACTIONS_PER_DAY,
            SettingCode.USER_MAX_EXPORTS_PER_MONTH, DEFAULT_USER_MAX_EXPORTS_PER_MONTH,
            SettingCode.USER_EXPORTS_FILES_DAYS_TO_LIVE, DEFAULT_USER_EXPORTS_FILES_DAYS_TO_LIVE
        );
        defaultSettings.forEach((code, value) -> {
            if (!settingRepository.existsByCodeAndUserAndEnabledTrue(code, user)) {
                var setting = Setting.builder()
                    .code(code)
                    .value(value.toString())
                    .user(user)
                    .build();
                settingRepository.save(setting);
            }
        });
    }

    @Nonnull
    public Integer getIntegerValue(@Nonnull User user, @Nonnull SettingCode code) {
        var setting = settingRepository.findByCodeAndUserAndEnabledTrue(code, user);
        return setting
            .map(value -> Integer.valueOf(value.getValue()))
            .orElse(defaultValue(code));
    }

    @Nonnull
    private Integer defaultValue(@Nonnull SettingCode code) {
        return switch (code) {
            case USER_MAX_PROFILES -> DEFAULT_USER_MAX_PROFILES.intValue();
            case USER_MAX_CATEGORIES -> DEFAULT_USER_MAX_CATEGORIES.intValue();
            case USER_MAX_WALLETS -> DEFAULT_USER_MAX_WALLETS.intValue();
            case USER_MAX_TRANSACTIONS_PER_DAY -> DEFAULT_USER_MAX_TRANSACTIONS_PER_DAY.intValue();
            case USER_MAX_EXPORTS_PER_MONTH -> DEFAULT_USER_MAX_EXPORTS_PER_MONTH.intValue();
            case USER_EXPORTS_FILES_DAYS_TO_LIVE -> DEFAULT_USER_EXPORTS_FILES_DAYS_TO_LIVE.intValue();
        };
    }
}
