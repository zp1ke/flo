package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.ProfileRepository;
import com.zp1ke.flo.data.repository.ProfileSpec;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final Validator validator;

    private final ProfileRepository profileRepository;

    private final SettingService settingService;

    @NonNull
    public Profile save(@NonNull Profile profile) {
        if (StringUtils.isBlank(profile.getCode())) {
            profile.setCode(DomainUtils
                .generateRandomCode((code) -> profileRepository.existsByUserAndCode(profile.getUser(), code)));
        }

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

        return profileRepository.save(profile);
    }

    public Optional<Profile> profileOfUserByCode(@NonNull User user, @NonNull String code) {
        return profileRepository.findByUserAndCode(user, code);
    }

    @NonNull
    public List<Profile> profilesOfUser(@NonNull User user) {
        return profileRepository.findAllByUser(user);
    }

    @NonNull
    public Page<Profile> profilesOfUser(@NonNull User user,
                                        @Nullable String nameFilter,
                                        @NonNull Pageable pageable) {
        var specification = ProfileSpec.withUser(user)
            .and(ProfileSpec.nameLike(nameFilter));
        return profileRepository.findAll(specification, pageable);
    }
}
