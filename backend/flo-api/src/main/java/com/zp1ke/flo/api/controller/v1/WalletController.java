package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.PageDto;
import com.zp1ke.flo.api.dto.WalletDto;
import com.zp1ke.flo.api.security.UserIsVerified;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.Wallet;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    public ResponseEntity<PageDto<WalletDto>> getWallets(@AuthenticationPrincipal User user,
                                                         @PathVariable String profileCode,
                                                         @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC)
                                                         Pageable pageable,
                                                         @RequestParam(required = false, name = "name") String nameFilter) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var wallets = walletService.walletsOfProfile(profile.get(), nameFilter, pageable);
            return ResponseEntity.ok(PageDto.of(wallets, WalletDto::fromWallet));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    @Operation(summary = "Add wallet data")
    @UserIsVerified
    public ResponseEntity<WalletDto> addWallet(@AuthenticationPrincipal User user,
                                               @PathVariable String profileCode,
                                               @RequestBody WalletDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var wallet = Wallet.builder()
                .code(request.getCode())
                .name(request.getName())
                .profile(profile.get())
                .balance(request.getBalance())
                .balanceVisible(request.getBalanceVisible())
                .build();
            var saved = walletService.save(wallet);
            var dto = WalletDto.fromWallet(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/{walletCode}")
    @Operation(summary = "Update wallet data")
    @UserIsVerified
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
                    .balanceVisible(request.getBalanceVisible())
                    .build();
                var saved = walletService.save(walletToUpdate);
                var dto = WalletDto.fromWallet(saved);
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping("/{walletCode}")
    @Operation(summary = "Delete wallet data")
    @UserIsVerified
    public ResponseEntity<Void> deleteWallet(@AuthenticationPrincipal User user,
                                             @PathVariable String profileCode,
                                             @PathVariable String walletCode) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var wallet = walletService.walletOfProfileByCode(profile.get(), walletCode);
        if (wallet.isPresent()) {
            walletService.delete(wallet.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
