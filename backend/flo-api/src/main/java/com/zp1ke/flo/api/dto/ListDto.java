package com.zp1ke.flo.api.dto;

import java.util.List;
import java.util.function.Function;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.NonNull;

@Getter
@SuperBuilder
public class ListDto<T> {
    private final List<T> list;

    @NonNull
    public static <T, R> ListDto<R> of(@NonNull List<T> list,
                                       @NonNull Function<T, R> mapper) {
        var mappedList = list.stream().map(mapper).toList();
        return ListDto.<R>builder().list(mappedList).build();
    }
}
