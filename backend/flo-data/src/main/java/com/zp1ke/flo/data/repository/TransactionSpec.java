package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Transaction;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class TransactionSpec {
    public static Specification<Transaction> createdBetween(@NonNull OffsetDateTime from,
                                                            @NonNull OffsetDateTime to) {
        return (root, query, builder)
            -> builder.between(root.get("created_at"), from, to);
    }

    public static Specification<Transaction> withCategories(@Nullable List<Long> categoriesIds) {
        return (root, query, builder) -> {
            if (categoriesIds == null || categoriesIds.isEmpty()) {
                return builder.conjunction();
            }
            return builder.in(root.join("categories").get("id")).value(categoriesIds);
        };
    }

    public static Specification<Transaction> withWallets(@Nullable List<Long> walletsIds) {
        return (root, query, builder) -> {
            if (walletsIds == null || walletsIds.isEmpty()) {
                return builder.conjunction();
            }
            return builder.in(root.join("wallets").get("id")).value(walletsIds);
        };
    }
}
