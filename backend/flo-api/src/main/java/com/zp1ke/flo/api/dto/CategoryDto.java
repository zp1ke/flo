package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Category;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import org.springframework.lang.NonNull;

@Getter
@Builder
public class CategoryDto {

    private String code;

    @Size(min = 3, message = "category.name-size")
    private String name;

    @NonNull
    public static CategoryDto fromCategory(@NonNull Category category) {
        return CategoryDto.builder()
            .code(category.getCode())
            .name(category.getName())
            .build();
    }

    @NonNull
    public Category toCategory() {
        return Category.builder()
            .code(code)
            .name(name)
            .build();
    }
}
