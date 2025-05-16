package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Wallet;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.WalletRepository;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final Validator validator;

    private final WalletRepository walletRepository;

    private final ProfileService profileService;

    private final SettingService settingService;

    @NonNull
    public Wallet save(@NonNull Wallet wallet) {
        if (StringUtils.isBlank(wallet.getCode())) {
            wallet.setCode(DomainUtils
                .generateRandomCode((code) -> walletRepository.existsByProfileAndCode(wallet.getProfile(), code)));
        }

        var violations = validator.validate(wallet);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("wallet.invalid", violations);
        }

        if (wallet.getId() == null) {
            // Check if a wallet with the same name already exists for the profile
            if (walletRepository.existsByProfileAndName(wallet.getProfile(), wallet.getName())) {
                throw new IllegalArgumentException("wallet.name-duplicate");
            }

            var maxWallets = settingService.getIntegerValue(wallet.getProfile().getUser(), SettingCode.USER_MAX_WALLETS);
            var profiles = profileService.profilesOfUser(wallet.getProfile().getUser());
            if (maxWallets != null && walletRepository.countByProfileIn(profiles) >= maxWallets) {
                throw new IllegalArgumentException("wallet.max-wallets-reached");
            }
        } else {
            // Check if a wallet with the same name already exists for the profile
            if (walletRepository.existsByProfileAndNameAndIdNot(wallet.getProfile(), wallet.getName(), wallet.getId())) {
                throw new IllegalArgumentException("wallet.name-duplicate");
            }
        }

        return walletRepository.save(wallet);
    }

    public Optional<Wallet> walletOfProfileByCode(@NonNull Profile profile, @NonNull String code) {
        return walletRepository.findByProfileAndCode(profile, code);
    }

    @NonNull
    public List<Wallet> walletsOfProfile(@NonNull Profile profile) {
        return walletRepository.findAllByProfile(profile);
    }

    @Nullable
    public List<Long> idsOfCodes(@NonNull Profile profile, @Nullable List<String> codes) {
        if (codes != null && !codes.isEmpty()) {
            return walletRepository.findAllByProfileAndCodeIn(profile, codes)
                .stream()
                .map(Wallet::getId)
                .toList();
        }
        return null;
    }
}
