package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.CategoryRepository;
import com.zp1ke.flo.data.repository.CategorySpec;
import com.zp1ke.flo.data.repository.TransactionRepository;
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
public class CategoryService {

    private final Validator validator;

    private final CategoryRepository categoryRepository;

    private final TransactionRepository transactionRepository;

    private final ProfileService profileService;

    private final SettingService settingService;

    @Nonnull
    public Category save(@Nonnull Category category) {
        if (StringUtils.isBlank(category.getCode())) {
            category.setCode(DomainUtils
                .generateRandomCode((code) -> categoryRepository.existsByProfileAndCode(category.getProfile(), code)));
        }

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

        return categoryRepository.save(category);
    }

    public Optional<Category> categoryOfProfileByCode(@Nonnull Profile profile, @Nonnull String code) {
        return categoryRepository.findByProfileAndCode(profile, code);
    }

    @Nonnull
    public Page<Category> categoriesOfProfile(@Nonnull Profile profile,
                                              String nameFilter,
                                              @Nonnull Pageable pageable) {
        var specification = CategorySpec.withProfile(profile)
            .and(CategorySpec.nameLike(nameFilter));
        return categoryRepository.findAll(specification, pageable);
    }

    public List<Long> idsOfCodes(@Nonnull Profile profile, List<String> codes) {
        if (codes != null && !codes.isEmpty()) {
            return categoryRepository.findAllByProfileAndCodeIn(profile, codes)
                .stream()
                .map(Category::getId)
                .toList();
        }
        return null;
    }

    public void delete(@Nonnull Category category) {
        var transactionsCount = transactionRepository.countByCategory(category);
        if (transactionsCount > 0) {
            throw new IllegalArgumentException("category.associated-transactions");
        }
        categoryRepository.delete(category);
    }
}
