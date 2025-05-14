package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Setting;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.SettingRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingService {

    private static final String DEFAULT_MAX_USER_PROFILES = "2";

    private final SettingRepository settingRepository;

    public void saveDefaultSettings(@NonNull User user) {
        var defaultSettings = Map.of(
            SettingCode.MAX_PROFILES, DEFAULT_MAX_USER_PROFILES
        );
        defaultSettings.forEach((code, value) -> {
            if (!settingRepository.existsByCodeAndUser(code, user)) {
                var setting = Setting.builder()
                    .code(code)
                    .value(value)
                    .user(user)
                    .build();
                settingRepository.save(setting);
            }
        });
    }

    public void clearAll() {
        settingRepository.deleteAll();
    }

    @Nullable
    public Integer getIntegerValue(@NonNull User user, @NonNull SettingCode code) {
        var setting = settingRepository.findByCodeAndUser(code, user);
        return setting
            .map(value -> Integer.valueOf(value.getValue()))
            .orElse(null);
    }
}
