package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.*;

@Entity
@Table(name = "users_exports", indexes = {
    @Index(name = "users_exports_idx_code", columnList = "code"),
    @Index(name = "users_exports_idx_user_id", columnList = "user_id"),
    @Index(name = "users_exports_idx_file_id", columnList = "file_id"),
    @Index(name = "users_exports_idx_created_at", columnList = "created_at"),
    @Index(name = "users_exports_idx_updated_at", columnList = "updated_at"),
    @Index(name = "users_exports_idx_expires_at", columnList = "expires_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class UserExport extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 50, message = "user_export.code-size")
    @Column(nullable = false, length = 50)
    private String code;

    @NotNull(message = "user_export.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotNull(message = "user_export.file-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "file_id", referencedColumnName = "id")
    private StorageFile file;

    @NotNull(message = "user_export.expires_at-required")
    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;
}
