package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.utils.StringUtils;
import org.springframework.data.jpa.domain.Specification;

public class CategorySpec {

    public static Specification<Category> withProfile(Profile profile) {
        return (root, query, builder)
            -> {
            if (profile == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("profile"), profile);
        };
    }

    public static Specification<Category> nameLike(String nameFilter) {
        return (root, query, builder)
            -> {
            if (StringUtils.isBlank(nameFilter)) {
                return builder.conjunction();
            }
            return builder.like(root.get("name"), "%" + nameFilter + "%");
        };
    }
}
