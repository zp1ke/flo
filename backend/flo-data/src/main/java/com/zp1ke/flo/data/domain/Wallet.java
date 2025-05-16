package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "wallets", indexes = {
    @Index(name = "wallets_unq_code_profile", columnList = "code, profile_id", unique = true),
    @Index(name = "wallets_idx_profile_id", columnList = "profile_id"),
    @Index(name = "wallets_idx_created_at", columnList = "created_at"),
    @Index(name = "wallets_idx_updated_at", columnList = "updated_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Wallet extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 50, message = "wallet.code-size")
    @Column(nullable = false, length = 50)
    private String code;

    @Size(min = 3, max = 255, message = "wallet.name-size")
    @NotBlank(message = "wallet.name-required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "wallet.profile-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;
}
