package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.ProfileRepository;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final Validator validator;

    private final ProfileRepository profileRepository;

    private final SettingService settingService;

    @NonNull
    public Profile save(@NonNull Profile profile) {
        var violations = validator.validate(profile);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("profile.invalid", violations);
        }

        if (profile.getId() == null) {
            // Check if a profile with the same name already exists for the user
            if (profileRepository.existsByUserAndName(profile.getUser(), profile.getName())) {
                throw new IllegalArgumentException("profile.name-duplicate");
            }

            var maxProfiles = settingService.getIntegerValue(profile.getUser(), SettingCode.USER_MAX_PROFILES);
            if (maxProfiles != null && profileRepository.countByUser(profile.getUser()) >= maxProfiles) {
                throw new IllegalArgumentException("profile.max-profiles-reached");
            }
        } else {
            // Check if a profile with the same name already exists for the user
            if (profileRepository.existsByUserAndNameAndIdNot(profile.getUser(), profile.getName(), profile.getId())) {
                throw new IllegalArgumentException("profile.name-duplicate");
            }
        }

        if (StringUtils.isBlank(profile.getCode())) {
            // Generate a random unique code
            String code;
            do {
                code = StringUtils.generateRandomCode(8);
            } while (profileRepository.existsByUserAndCode(profile.getUser(), code));

            profile.setCode(code);
        }

        return profileRepository.save(profile);
    }

    public Optional<Profile> profileOfUserByCode(@NonNull User user, @NonNull String code) {
        return profileRepository.findByUserAndCode(user, code);
    }

    @NonNull
    public List<Profile> profilesOfUser(@NonNull User user) {
        return profileRepository.findAllByUser(user);
    }

    public void clearAll() {
        profileRepository.deleteAll();
    }
}
