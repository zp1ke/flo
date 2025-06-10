package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class TransactionSpec {
    public static Specification<Transaction> withProfile(Profile profile) {
        return (root, query, builder)
            -> {
            if (profile == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("profile"), profile);
        };
    }

    public static Specification<Transaction> datetimeBetween(OffsetDateTime from,
                                                             OffsetDateTime to) {
        return (root, query, builder)
            -> {
            if (from == null && to == null) {
                return builder.conjunction();
            }
            if (from == null) {
                return builder.lessThanOrEqualTo(root.get("datetime"), to);
            }
            if (to == null) {
                return builder.greaterThanOrEqualTo(root.get("datetime"), from);
            }
            return builder.between(root.get("datetime"), from, to);
        };
    }

    public static Specification<Transaction> withCategories(List<Long> categoriesIds) {
        return (root, query, builder) -> {
            if (categoriesIds == null || categoriesIds.isEmpty()) {
                return builder.conjunction();
            }
            return builder.in(root.join("categories").get("id")).value(categoriesIds);
        };
    }

    public static Specification<Transaction> withWallets(List<Long> walletsIds) {
        return (root, query, builder) -> {
            if (walletsIds == null || walletsIds.isEmpty()) {
                return builder.conjunction();
            }
            return builder.in(root.join("wallets").get("id")).value(walletsIds);
        };
    }
}
