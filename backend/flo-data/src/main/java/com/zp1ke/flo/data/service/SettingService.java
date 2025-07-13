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

    private static final String DEFAULT_USER_MAX_PROFILES = "2";

    private static final String DEFAULT_USER_MAX_CATEGORIES = "5";

    private static final String DEFAULT_USER_MAX_WALLETS = "3";

    private static final String DEFAULT_USER_MAX_TRANSACTIONS_PER_DAY = "20";

    private static final String DEFAULT_USER_MAX_EXPORTS_PER_MONTH = "1";

    private final SettingRepository settingRepository;

    public void saveDefaultSettings(@Nonnull User user) {
        var defaultSettings = Map.of(
            SettingCode.USER_MAX_PROFILES, DEFAULT_USER_MAX_PROFILES,
            SettingCode.USER_MAX_CATEGORIES, DEFAULT_USER_MAX_CATEGORIES,
            SettingCode.USER_MAX_WALLETS, DEFAULT_USER_MAX_WALLETS,
            SettingCode.USER_MAX_TRANSACTIONS_PER_DAY, DEFAULT_USER_MAX_TRANSACTIONS_PER_DAY,
            SettingCode.USER_MAX_EXPORTS_PER_MONTH, DEFAULT_USER_MAX_EXPORTS_PER_MONTH
        );
        defaultSettings.forEach((code, value) -> {
            if (!settingRepository.existsByCodeAndUserAndEnabledTrue(code, user)) {
                var setting = Setting.builder()
                    .code(code)
                    .value(value)
                    .user(user)
                    .build();
                settingRepository.save(setting);
            }
        });
    }

    public Integer getIntegerValue(@Nonnull User user, @Nonnull SettingCode code) {
        var setting = settingRepository.findByCodeAndUserAndEnabledTrue(code, user);
        return setting
            .map(value -> Integer.valueOf(value.getValue()))
            .orElse(null);
    }
}
