package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.*;

@Entity
@Table(name = "users_tokens", indexes = {
    @Index(name = "users_tokens_unq_token_user", columnList = "token, user_id", unique = true),
    @Index(name = "users_tokens_idx_user_id", columnList = "user_id"),
    @Index(name = "users_tokens_idx_created_at", columnList = "created_at"),
    @Index(name = "users_tokens_idx_updated_at", columnList = "updated_at"),
    @Index(name = "users_tokens_idx_remote_address", columnList = "remote_address"),
    @Index(name = "users_tokens_idx_expires_at", columnList = "expires_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class UserToken extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 500, message = "user_token.code-size")
    @Column(nullable = false, length = 500)
    private String token;

    @Size(min = 1, max = 255, message = "user_token.remote_address-size")
    @Column(nullable = false, name = "remote_address")
    private String remoteAddress;

    @NotNull(message = "user_token.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    public boolean isValid() {
        return expiresAt.isAfter(OffsetDateTime.now());
    }
}
