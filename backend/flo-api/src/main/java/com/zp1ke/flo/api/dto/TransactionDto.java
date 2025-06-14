package com.zp1ke.flo.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import com.zp1ke.flo.data.service.CategoryService;
import com.zp1ke.flo.data.service.WalletService;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TransactionDto {

    private String code;

    @Size(max = 255, message = "transaction.description-size")
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime datetime;

    @NotNull(message = "transaction.amount-required")
    private BigDecimal amount;

    @NotNull(message = "transaction.category-required")
    private String categoryCode;

    @NotNull(message = "transaction.wallet-required")
    private String walletCode;

    @Nonnull
    public static TransactionDto fromTransaction(@Nonnull Transaction transaction) {
        return TransactionDto.builder()
            .code(transaction.getCode())
            .description(transaction.getDescription())
            .datetime(transaction.getDatetime())
            .amount(transaction.getAmount())
            .categoryCode(transaction.getCategory().getCode())
            .walletCode(transaction.getWallet().getCode())
            .build();
    }

    @Nonnull
    public Transaction toTransaction(@Nonnull Profile profile,
                                     @Nonnull CategoryService categoryService,
                                     @Nonnull WalletService walletService) {
        return Transaction.builder()
            .code(code)
            .description(description)
            .datetime(datetime != null ? datetime : OffsetDateTime.now())
            .amount(amount)
            .profile(profile)
            .category(categoryService.categoryOfProfileByCode(profile, categoryCode).orElse(null))
            .wallet(walletService.walletOfProfileByCode(profile, walletCode).orElse(null))
            .build();
    }
}
