package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Wallet;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import org.springframework.lang.NonNull;

@Getter
@Builder
public class WalletDto {

    private String code;

    @Size(min = 3, message = "wallet.name-size")
    private String name;

    @NonNull
    public static WalletDto fromWallet(@NonNull Wallet wallet) {
        return WalletDto.builder()
            .code(wallet.getCode())
            .name(wallet.getName())
            .build();
    }

    @NonNull
    public Wallet toWallet() {
        return Wallet.builder()
            .code(code)
            .name(name)
            .build();
    }
}
