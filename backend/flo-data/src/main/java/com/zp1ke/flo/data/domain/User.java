package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.tools.model.Mappable;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "users_unq_email", columnList = "email", unique = true),
    @Index(name = "users_unq_username", columnList = "username", unique = true),
    @Index(name = "users_idx_created_at", columnList = "created_at"),
    @Index(name = "users_idx_updated_at", columnList = "updated_at"),
    @Index(name = "users_idx_verify_code", columnList = "verify_code"),
    @Index(name = "users_idx_enabled", columnList = "enabled"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class User extends Auditable implements Mappable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(max = 255, message = "user.email-size")
    @Email(message = "user.email-invalid")
    @NotBlank(message = "user.email-required")
    @Column(nullable = false)
    private String email;

    @Size(min = 3, max = 255, message = "user.username-size")
    @NotBlank(message = "user.username-required")
    @Column(nullable = false)
    private String username;

    @Size(max = 255, message = "user.password-size")
    @NotBlank(message = "user.password-empty")
    @Column(nullable = false)
    private String password;

    @Column(name = "verify_code")
    private String verifyCode;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    /**
     * Indicates whether the entity is enabled or not.
     * If false, the entity is considered disabled and should not be used in operations.
     */
    @Column
    @Builder.Default
    private boolean enabled = true;

    public void generateUsernameIfMissing() {
        if (StringUtils.isBlank(username) && StringUtils.isNotBlank(email)) {
            username = email.split("@")[0];
        }
    }

    public boolean isVerified() {
        return verifiedAt != null;
    }

    public boolean isNotVerified() {
        return !isVerified();
    }

    @Override
    public String toString() {
        return String.format("User{id=%d, email='%s'}", id, email);
    }

    @Nonnull
    @Override
    public List<String> getProperties() {
        var list = new ArrayList<>(super.getProperties());
        list.addAll(List.of("email", "username", "verifiedAt"));
        return list;
    }

    @Override
    public String getValue(@Nonnull String property) {
        var value = super.getValue(property);
        if (value == null) {
            value = switch (property) {
                case "email" -> email;
                case "username" -> username;
                case "verifiedAt" -> verifiedAt != null ? verifiedAt.toString() : null;
                default -> null;
            };
        }
        return value;
    }
}