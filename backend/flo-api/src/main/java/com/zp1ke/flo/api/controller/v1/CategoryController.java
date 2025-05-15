package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.CategoryDto;
import com.zp1ke.flo.api.dto.ListDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.CategoryService;
import com.zp1ke.flo.data.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles/{profileCode}/categories")
@RequiredArgsConstructor
@Tag(name = "categories", description = "Category categories")
public class CategoryController {

    private final ProfileService profileService;

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get categories")
    public ResponseEntity<ListDto<CategoryDto>> getCategories(@AuthenticationPrincipal User user,
                                                              @PathVariable String profileCode) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var categories = categoryService.categoriesOfProfile(profile.get()).stream()
                .map(CategoryDto::fromCategory)
                .toList();
            return ResponseEntity.ok(new ListDto<>(categories));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    @Operation(summary = "Add category data")
    public ResponseEntity<CategoryDto> addCategory(@AuthenticationPrincipal User user,
                                                   @PathVariable String profileCode,
                                                   @RequestBody CategoryDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var category = request.toCategory();
            category.setProfile(profile.get());
            var saved = categoryService.save(category);
            var dto = CategoryDto.fromCategory(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/{categoryCode}")
    @Operation(summary = "Update profile data")
    public ResponseEntity<CategoryDto> updateCategory(@AuthenticationPrincipal User user,
                                                      @PathVariable String profileCode,
                                                      @PathVariable String categoryCode,
                                                      @RequestBody CategoryDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var category = categoryService.categoryOfProfileByCode(profile.get(), categoryCode);
            if (category.isPresent()) {
                var categoryToUpdate = category.get().toBuilder()
                    .name(request.getName())
                    .build();
                var saved = categoryService.save(categoryToUpdate);
                var dto = CategoryDto.fromCategory(saved);
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
