package com.zp1ke.flo.api.dto;

import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.function.Function;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class ListDto<T> {
    private final List<T> list;

    @Nonnull
    public static <T, R> ListDto<R> of(@Nonnull List<T> list,
                                       @Nonnull Function<T, R> mapper) {
        var mappedList = list.stream().map(mapper).toList();
        return ListDto.<R>builder().list(mappedList).build();
    }
}
