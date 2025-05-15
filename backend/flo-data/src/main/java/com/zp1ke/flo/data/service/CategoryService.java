package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.CategoryRepository;
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
public class CategoryService {

    private final Validator validator;

    private final CategoryRepository categoryRepository;

    private final ProfileService profileService;

    private final SettingService settingService;

    @NonNull
    public Category save(@NonNull Category category) {
        var violations = validator.validate(category);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("category.invalid", violations);
        }

        if (category.getId() == null) {
            // Check if a category with the same name already exists for the profile
            if (categoryRepository.existsByProfileAndName(category.getProfile(), category.getName())) {
                throw new IllegalArgumentException("category.name-duplicate");
            }

            var maxCategories = settingService.getIntegerValue(category.getProfile().getUser(), SettingCode.USER_MAX_CATEGORIES);
            var profiles = profileService.profilesOfUser(category.getProfile().getUser());
            if (maxCategories != null && categoryRepository.countByProfileIn(profiles) >= maxCategories) {
                throw new IllegalArgumentException("category.max-categories-reached");
            }
        } else {
            // Check if a category with the same name already exists for the profile
            if (categoryRepository.existsByProfileAndNameAndIdNot(category.getProfile(), category.getName(), category.getId())) {
                throw new IllegalArgumentException("category.name-duplicate");
            }
        }

        if (StringUtils.isBlank(category.getCode())) {
            // Generate a random unique code
            String code;
            do {
                code = StringUtils.generateRandomCode(8);
            } while (categoryRepository.existsByProfileAndCode(category.getProfile(), code));

            category.setCode(code);
        }

        return categoryRepository.save(category);
    }

    public Optional<Category> categoryOfProfileByCode(@NonNull Profile profile, @NonNull String code) {
        return categoryRepository.findByProfileAndCode(profile, code);
    }

    @NonNull
    public List<Category> categoriesOfProfile(@NonNull Profile profile) {
        return categoryRepository.findAllByProfile(profile);
    }

    public void clearAll() {
        categoryRepository.deleteAll();
    }
}
