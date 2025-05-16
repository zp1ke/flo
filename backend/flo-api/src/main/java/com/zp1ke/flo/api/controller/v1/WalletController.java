package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.WalletDto;
import com.zp1ke.flo.api.dto.ListDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.WalletService;
import com.zp1ke.flo.data.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles/{profileCode}/wallets")
@RequiredArgsConstructor
@Tag(name = "wallets", description = "Profile wallets")
public class WalletController {

    private final ProfileService profileService;

    private final WalletService walletService;

    @GetMapping
    @Operation(summary = "Get wallets")
    public ResponseEntity<ListDto<WalletDto>> getWallets(@AuthenticationPrincipal User user,
                                                              @PathVariable String profileCode) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var wallets = walletService.walletsOfProfile(profile.get()).stream()
                .map(WalletDto::fromWallet)
                .toList();
            return ResponseEntity.ok(new ListDto<>(wallets));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    @Operation(summary = "Add wallet data")
    public ResponseEntity<WalletDto> addWallet(@AuthenticationPrincipal User user,
                                                   @PathVariable String profileCode,
                                                   @RequestBody WalletDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var wallet = request.toWallet();
            wallet.setProfile(profile.get());
            var saved = walletService.save(wallet);
            var dto = WalletDto.fromWallet(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/{walletCode}")
    @Operation(summary = "Update wallet data")
    public ResponseEntity<WalletDto> updateWallet(@AuthenticationPrincipal User user,
                                                      @PathVariable String profileCode,
                                                      @PathVariable String walletCode,
                                                      @RequestBody WalletDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var wallet = walletService.walletOfProfileByCode(profile.get(), walletCode);
            if (wallet.isPresent()) {
                var walletToUpdate = wallet.get().toBuilder()
                    .name(request.getName())
                    .build();
                var saved = walletService.save(walletToUpdate);
                var dto = WalletDto.fromWallet(saved);
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
