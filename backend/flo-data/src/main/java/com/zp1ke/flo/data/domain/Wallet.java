package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.tools.model.Mappable;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "wallets", indexes = {
    @Index(name = "wallets_unq_code_profile", columnList = "code, profile_id", unique = true),
    @Index(name = "wallets_idx_profile_id", columnList = "profile_id"),
    @Index(name = "wallets_idx_created_at", columnList = "created_at"),
    @Index(name = "wallets_idx_updated_at", columnList = "updated_at"),
    @Index(name = "wallets_idx_enabled", columnList = "enabled"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Wallet extends Auditable implements Mappable {

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

    @Column(name = "last_transaction_at")
    private OffsetDateTime lastTransactionAt;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "balance_visible")
    @Builder.Default
    private boolean balanceVisible = true;

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
                case "lastTransactionAt" -> lastTransactionAt != null ? lastTransactionAt.toString() : null;
                case "balance" -> balance.toString();
                case "balanceVisible" -> Boolean.toString(balanceVisible);
                default -> null;
            };
        }
        return value;
    }
}
