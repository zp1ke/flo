package com.zp1ke.flo.api.dto;

import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.function.Function;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;

@Getter
@SuperBuilder
public class PageDto<T> {
    private final int page;

    private final int size;

    private final long totalElements;

    private final int totalPages;

    private final List<T> list;

    @Nonnull
    public static <T, R> PageDto<R> of(@Nonnull Page<T> page,
                                       @Nonnull Function<T, R> mapper) {
        var list = page.getContent().stream().map(mapper).toList();
        return PageDto.<R>builder()
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .list(list)
            .build();
    }
}
