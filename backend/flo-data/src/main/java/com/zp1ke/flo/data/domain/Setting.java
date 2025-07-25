package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.data.model.SettingCode;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "settings", indexes = {
    @Index(name = "settings_unq_code_user", columnList = "code, user_id", unique = true),
    @Index(name = "settings_idx_user_id", columnList = "user_id"),
    @Index(name = "settings_idx_created_at", columnList = "created_at"),
    @Index(name = "settings_idx_updated_at", columnList = "updated_at"),
    @Index(name = "settings_idx_enabled", columnList = "enabled"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Setting extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SettingCode code;

    @Size(min = 1, max = 255, message = "setting.value-size")
    @NotBlank(message = "setting.value-required")
    @Column(nullable = false)
    private String value;

    @NotNull(message = "setting.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    /**
     * Indicates whether the entity is enabled or not.
     * If false, the entity is considered disabled and should not be used in operations.
     */
    @Column
    @Builder.Default
    private boolean enabled = true;
}
