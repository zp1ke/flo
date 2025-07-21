package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Wallet;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WalletDto {

    private String code;

    @Size(min = 3, message = "wallet.name-size")
    private String name;

    private OffsetDateTime lastTransactionAt;

    private BigDecimal balance;

    private Boolean balanceVisible;

    @Nonnull
    public static WalletDto fromWallet(@Nonnull Wallet wallet) {
        var builder = WalletDto.builder()
            .code(wallet.getCode())
            .name(wallet.getName())
            .lastTransactionAt(wallet.getLastTransactionAt())
            .balanceVisible(wallet.isBalanceVisible());
        if (wallet.isBalanceVisible()) {
            builder.balance(wallet.getBalance());
        }
        return builder.build();
    }
}
