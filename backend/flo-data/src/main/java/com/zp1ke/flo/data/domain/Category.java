package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.tools.model.Mappable;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "categories_unq_code_profile", columnList = "code, profile_id", unique = true),
    @Index(name = "categories_idx_profile_id", columnList = "profile_id"),
    @Index(name = "categories_idx_created_at", columnList = "created_at"),
    @Index(name = "categories_idx_updated_at", columnList = "updated_at"),
    @Index(name = "categories_idx_enabled", columnList = "enabled"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Category extends Auditable implements Mappable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 50, message = "category.code-size")
    @Column(nullable = false, length = 50)
    private String code;

    @Size(min = 3, max = 255, message = "category.name-size")
    @NotBlank(message = "category.name-required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "category.profile-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;

    /**
     * Indicates whether the entity is enabled or not.
     * If false, the entity is considered disabled and should not be used in operations.
     */
    @Column
    @Builder.Default
    private boolean enabled = true;

    @Nonnull
    @Override
    public List<String> getProperties() {
        var list = new ArrayList<>(super.getProperties());
        list.addAll(List.of("code", "name", "profile"));
        return list;
    }

    @Override
    public String getValue(@Nonnull String property) {
        var value = super.getValue(property);
        if (value == null) {
            value = switch (property) {
                case "code" -> code;
                case "name" -> name;
                case "profile" -> profile.getCode();
                default -> null;
            };
        }
        return value;
    }
}
