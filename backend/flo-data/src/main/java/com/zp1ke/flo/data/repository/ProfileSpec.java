package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.utils.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

public class ProfileSpec {

    public static Specification<Profile> withUser(@Nullable User user) {
        return (root, query, builder)
            -> {
            if (user == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("user"), user);
        };
    }

    public static Specification<Profile> nameLike(@Nullable String nameFilter) {
        return (root, query, builder)
            -> {
            if (StringUtils.isBlank(nameFilter)) {
                return builder.conjunction();
            }
            return builder.like(root.get("name"), "%" + nameFilter + "%");
        };
    }
}
