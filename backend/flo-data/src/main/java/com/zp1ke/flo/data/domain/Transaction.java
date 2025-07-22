package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import com.zp1ke.flo.tools.model.Mappable;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "transactions_unq_code_profile", columnList = "code, profile_id", unique = true),
    @Index(name = "transactions_idx_profile_id", columnList = "profile_id"),
    @Index(name = "transactions_idx_datetime", columnList = "datetime"),
    @Index(name = "transactions_idx_created_at", columnList = "created_at"),
    @Index(name = "transactions_idx_updated_at", columnList = "updated_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Transaction extends Auditable implements Mappable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 3, max = 50, message = "transaction.code-size")
    @Column(nullable = false, length = 50)
    private String code;

    @Size(max = 255, message = "transaction.description-size")
    @Column
    private String description;

    @NotNull(message = "transaction.datetime-required")
    @Column(nullable = false)
    private OffsetDateTime datetime;

    @NotNull(message = "transaction.amount-required")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "transaction.profile-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;

    @NotNull(message = "transaction.category-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @NotNull(message = "transaction.wallet-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "wallet_id", referencedColumnName = "id")
    private Wallet wallet;

    @Column(nullable = false, name = "wallet_balance_after", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal walletBalanceAfter = BigDecimal.ZERO;

    @Nonnull
    @Override
    public List<String> getProperties() {
        var list = new ArrayList<>(super.getProperties());
        list.addAll(List.of(
            "code", "description", "datetime", "amount", "profile",
            "category", "wallet", "wallet_balance_after"));
        return list;
    }

    @Override
    public String getValue(@Nonnull String property) {
        var value = super.getValue(property);
        if (value == null) {
            value = switch (property) {
                case "code" -> code;
                case "description" -> description;
                case "datetime" -> datetime.toString();
                case "amount" -> amount.toString();
                case "profile" -> profile.getCode();
                case "category" -> category.getCode();
                case "wallet" -> wallet.getCode();
                case "wallet_balance_after" -> walletBalanceAfter.toString();
                default -> null;
            };
        }
        return value;
    }
}
