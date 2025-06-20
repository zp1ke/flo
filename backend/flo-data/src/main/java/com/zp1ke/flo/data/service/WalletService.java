package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Wallet;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.repository.TransactionRepository;
import com.zp1ke.flo.data.repository.WalletRepository;
import com.zp1ke.flo.data.repository.WalletSpec;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final Validator validator;

    private final WalletRepository walletRepository;

    private final TransactionRepository transactionRepository;

    private final ProfileService profileService;

    private final SettingService settingService;

    @Nonnull
    public Wallet save(@Nonnull Wallet wallet) {
        if (StringUtils.isBlank(wallet.getCode())) {
            wallet.setCode(DomainUtils
                .generateRandomCode((code) -> walletRepository
                    .existsByProfileAndCodeAndEnabledTrue(wallet.getProfile(), code)));
        }

        var violations = validator.validate(wallet);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("wallet.invalid", violations);
        }

        if (wallet.getId() == null) {
            // Check if a wallet with the same name already exists for the profile
            if (walletRepository.existsByProfileAndNameAndEnabledTrue(wallet.getProfile(), wallet.getName())) {
                throw new IllegalArgumentException("wallet.name-duplicate");
            }

            var maxWallets = settingService.getIntegerValue(wallet.getProfile().getUser(),
                SettingCode.USER_MAX_WALLETS);
            var profiles = profileService.profilesOfUser(wallet.getProfile().getUser());
            if (maxWallets != null && walletRepository.countByEnabledTrueAndProfileIn(profiles) >= maxWallets) {
                throw new IllegalArgumentException("wallet.max-wallets-reached");
            }
        } else {
            // Check if a wallet with the same name already exists for the profile
            if (walletRepository.existsByProfileAndNameAndIdNotAndEnabledTrue(wallet.getProfile(), wallet.getName(),
                wallet.getId())) {
                throw new IllegalArgumentException("wallet.name-duplicate");
            }
        }

        return walletRepository.save(wallet);
    }

    public Optional<Wallet> walletOfProfileByCode(@Nonnull Profile profile, @Nonnull String code) {
        return walletRepository.findByProfileAndCodeAndEnabledTrue(profile, code);
    }

    @Nonnull
    public Page<Wallet> walletsOfProfile(@Nonnull Profile profile,
                                         String nameFilter,
                                         @Nonnull Pageable pageable) {
        var specification = WalletSpec.withProfile(profile)
            .and(WalletSpec.nameLike(nameFilter));
        return walletRepository.findAll(specification, pageable);
    }

    public List<Long> idsOfCodes(@Nonnull Profile profile, List<String> codes) {
        if (codes != null && !codes.isEmpty()) {
            return walletRepository.findAllByProfileAndCodeInAndEnabledTrue(profile, codes)
                .stream()
                .map(Wallet::getId)
                .toList();
        }
        return null;
    }

    public void delete(@Nonnull Wallet wallet) {
        var count = transactionRepository.countByWallet(wallet);
        if (count > 0) {
            wallet.setEnabled(false);
            walletRepository.save(wallet);
        } else {
            walletRepository.delete(wallet);
        }
    }
}
