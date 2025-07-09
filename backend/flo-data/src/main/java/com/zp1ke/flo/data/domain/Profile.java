package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.tools.model.Mappable;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.*;

@Entity
@Table(name = "profiles", indexes = {
    @Index(name = "profiles_unq_code_user", columnList = "code, user_id", unique = true),
    @Index(name = "profiles_idx_user_id", columnList = "user_id"),
    @Index(name = "profiles_idx_created_at", columnList = "created_at"),
    @Index(name = "profiles_idx_updated_at", columnList = "updated_at"),
    @Index(name = "profiles_idx_enabled", columnList = "enabled"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Profile extends Auditable implements Mappable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 50, message = "profile.code-size")
    @Column(nullable = false, length = 50)
    private String code;

    @Size(min = 3, max = 255, message = "profile.name-size")
    @NotBlank(message = "profile.name-required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "profile.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Size(max = 50, message = "profile.language-size")
    @Column(length = 50)
    private String language;

    /**
     * Indicates whether the entity is enabled or not.
     * If false, the entity is considered disabled and should not be used in operations.
     */
    @Column
    @Builder.Default
    private boolean enabled = true;

    public Locale getLocale() {
        if (StringUtils.isNotBlank(language)) {
            return Locale.forLanguageTag(language);
        }
        return Locale.getDefault();
    }

    @Override
    public String toString() {
        return String.format("Profile{code=%s}", code);
    }

    @Nonnull
    @Override
    public List<String> getProperties() {
        var list = new ArrayList<>(super.getProperties());
        list.addAll(List.of("code", "name", "language"));
        return list;
    }

    @Override
    public String getValue(@Nonnull String property) {
        var value = super.getValue(property);
        if (value == null) {
            value = switch (property) {
                case "code" -> code;
                case "name" -> name;
                case "language" -> language;
                default -> null;
            };
        }
        return value;
    }
}
