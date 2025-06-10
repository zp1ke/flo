package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Wallet;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WalletDto {

    private String code;

    @Size(min = 3, message = "wallet.name-size")
    private String name;

    @Nonnull
    public static WalletDto fromWallet(@Nonnull Wallet wallet) {
        return WalletDto.builder()
            .code(wallet.getCode())
            .name(wallet.getName())
            .build();
    }

    @Nonnull
    public Wallet toWallet(@Nonnull Profile profile) {
        return Wallet.builder()
            .code(code)
            .name(name)
            .profile(profile)
            .build();
    }
}
