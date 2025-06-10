package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDto {

    private String code;

    @Size(min = 3, message = "category.name-size")
    private String name;

    @Nonnull
    public static CategoryDto fromCategory(@Nonnull Category category) {
        return CategoryDto.builder()
            .code(category.getCode())
            .name(category.getName())
            .build();
    }

    @Nonnull
    public Category toCategory(@Nonnull Profile profile) {
        return Category.builder()
            .code(code)
            .name(name)
            .profile(profile)
            .build();
    }
}
