package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.ProfileRepository;
import com.zp1ke.flo.data.repository.ProfileSpec;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final Validator validator;

    private final ProfileRepository profileRepository;

    private final SettingService settingService;

    @Nonnull
    public Profile save(@Nonnull Profile profile) {
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
                throw new IllegalArgumentException("profile.max_profiles_reached");
            }
        } else {
            // Check if a profile with the same name already exists for the user
            if (profileRepository.existsByUserAndNameAndIdNot(profile.getUser(), profile.getName(), profile.getId())) {
                throw new IllegalArgumentException("profile.name-duplicate");
            }
        }

        return profileRepository.save(profile);
    }

    public Optional<Profile> profileOfUserByCode(@Nonnull User user, @Nonnull String code) {
        return profileRepository.findByUserAndCode(user, code);
    }

    @Nonnull
    public List<Profile> profilesOfUser(@Nonnull User user) {
        return profileRepository.findAllByUser(user);
    }

    @Nonnull
    public Page<Profile> profilesOfUser(@Nonnull User user,
                                        String nameFilter,
                                        @Nonnull Pageable pageable) {
        var specification = ProfileSpec.withUser(user)
            .and(ProfileSpec.nameLike(nameFilter));
        return profileRepository.findAll(specification, pageable);
    }

    public void delete(@Nonnull Profile profile) {
        if (profileRepository.countByUser(profile.getUser()) == 1) {
            throw new IllegalArgumentException("profile.one-profile-required");
        }
        // TODO: Check if profile is used by any other entities (e.g., categories, wallets)
        profileRepository.delete(profile);
    }

    public Optional<Profile> firstProfileOfUser(@Nonnull User user) {
        return profileRepository.findTopByUserOrderByCreatedAtAsc(user);
    }
}
