package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.CategoryDto;
import com.zp1ke.flo.api.dto.PageDto;
import com.zp1ke.flo.api.security.UserIsVerified;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.CategoryService;
import com.zp1ke.flo.data.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles/{profileCode}/categories")
@RequiredArgsConstructor
@Tag(name = "categories", description = "Profile categories")
public class CategoryController {

    private final ProfileService profileService;

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get categories")
    public ResponseEntity<PageDto<CategoryDto>> getCategories(@AuthenticationPrincipal User user,
                                                              @PathVariable String profileCode,
                                                              @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC)
                                                              Pageable pageable,
                                                              @RequestParam(required = false, name = "name") String nameFilter) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var categories = categoryService.categoriesOfProfile(profile.get(), nameFilter, pageable);
            return ResponseEntity.ok(PageDto.of(categories, CategoryDto::fromCategory));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    @Operation(summary = "Add category data")
    @UserIsVerified
    public ResponseEntity<CategoryDto> addCategory(@AuthenticationPrincipal User user,
                                                   @PathVariable String profileCode,
                                                   @RequestBody CategoryDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var category = request.toCategory(profile.get());
            var saved = categoryService.save(category);
            var dto = CategoryDto.fromCategory(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/{categoryCode}")
    @Operation(summary = "Update category data")
    @UserIsVerified
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

    @DeleteMapping("/{categoryCode}")
    @Operation(summary = "Delete category data")
    @UserIsVerified
    public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal User user,
                                               @PathVariable String profileCode,
                                               @PathVariable String categoryCode) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var category = categoryService.categoryOfProfileByCode(profile.get(), categoryCode);
        if (category.isPresent()) {
            categoryService.delete(category.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
