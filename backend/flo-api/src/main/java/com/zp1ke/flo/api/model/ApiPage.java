package com.zp1ke.flo.api.model;

import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.function.Function;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

/**
 * A standardized pagination response wrapper for API endpoints.
 * <p>
 * This class provides a consistent structure for returning paginated data in API responses.
 * It transforms Spring Data's {@link Page} objects into a format suitable for API consumers,
 * containing both the content elements and the pagination metadata.
 * </p>
 * <p>
 * The class is generic, allowing it to wrap any type of content, and includes standard
 * pagination information like page size, current page number, total elements, and total pages.
 * </p>
 * <p>
 * This wrapper is typically used in REST controllers to standardize the structure of
 * paginated responses across the API, facilitating consistent client-side pagination handling.
 * </p>
 * <p>
 * Example usage:
 * <pre>
 * Page&lt;Game&gt; gamesPage = gameService.findBy(searchRequest, pageable);
 * return ApiPage.of(gamesPage, GameDto::from);
 * </pre>
 * </p>
 *
 * @param <T> the type of elements in the page content
 */
@Getter
@Builder
public class ApiPage<T> {
    @Builder.Default
    private List<T> content = List.of();

    @Builder.Default
    private int size = 0;

    @Builder.Default
    private int number = 0;

    @Builder.Default
    private long totalElements = 0;

    @Builder.Default
    private int totalPages = 0;

    /**
     * Creates an ApiPage instance from a Spring Data {@link Page} object with transformation.
     * <p>
     * This factory method converts a Spring Data Page to an ApiPage by:
     * <ul>
     *   <li>Mapping each content item using the provided mapper function</li>
     *   <li>Copying all pagination metadata (size, number, totalElements, totalPages)</li>
     * </ul>
     * </p>
     * <p>
     * This method is particularly useful when the domain entities need to be transformed
     * into DTOs before being exposed through the API.
     * </p>
     *
     * @param <I>    the type of elements in the source Page
     * @param <T>    the type of elements in the resulting ApiPage
     * @param page   the Spring Data Page to convert, must not be null
     * @param mapper the function to map from source type I to target type T, must not be null
     * @return a new ApiPage containing the transformed content and pagination metadata
     * @throws NullPointerException if the page or mapper is null
     */
    @Nonnull
    public static <I, T> ApiPage<T> of(@Nonnull Page<I> page, @Nonnull Function<I, T> mapper) {
        return ApiPage.<T>builder()
            .content(page.getContent().stream().map(mapper).toList())
            .size(page.getSize())
            .number(page.getNumber())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .build();
    }
}