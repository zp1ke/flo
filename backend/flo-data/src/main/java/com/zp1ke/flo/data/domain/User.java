package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "users_unq_email", columnList = "email", unique = true),
    @Index(name = "users_unq_username", columnList = "username", unique = true),
    @Index(name = "users_idx_created_at", columnList = "created_at"),
    @Index(name = "users_idx_updated_at", columnList = "updated_at"),
})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Email(message = "user.email-invalid")
    @NotBlank(message = "user.email-required")
    @Column(nullable = false)
    private String email;

    @Size(min = 3, message = "user.username-size")
    @NotBlank(message = "user.username-required")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "user.password-empty")
    @Column(nullable = false)
    private String password;

    public void generateUsernameIfMissing() {
        if (StringUtils.isBlank(username) && StringUtils.isNotBlank(email)) {
            username = email.split("@")[0];
        }
    }
}