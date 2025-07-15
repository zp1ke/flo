package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import com.zp1ke.flo.data.model.SettingCode;
import com.zp1ke.flo.data.model.TransactionsStats;
import com.zp1ke.flo.data.repository.TransactionRepository;
import com.zp1ke.flo.data.repository.TransactionSpec;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.DateTimeUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final Validator validator;

    private final TransactionRepository transactionRepository;

    private final CategoryService categoryService;

    private final WalletService walletService;

    private final ProfileService profileService;

    private final SettingService settingService;

    @Nonnull
    public Transaction save(@Nonnull Transaction transaction) {
        if (StringUtils.isBlank(transaction.getCode())) {
            transaction.setCode(DomainUtils
                .generateRandomCode((code) -> transactionRepository.existsByProfileAndCode(transaction.getProfile(), code)));
        }

        var maxTransactions = settingService.getIntegerValue(
            transaction.getProfile().getUser(),
            SettingCode.USER_MAX_TRANSACTIONS_PER_DAY);
        var profiles = profileService.profilesOfUser(transaction.getProfile().getUser());
        var from = DateTimeUtils.toOffsetDateTime(LocalDate.now());
        var to = DateTimeUtils.toOffsetDateTime(LocalDate.now().atTime(LocalTime.MAX));
        if (transactionRepository.countByCreatedAtBetweenAndProfileIn(from, to, profiles) >= maxTransactions) {
            throw new IllegalArgumentException("transaction.max-transactions-per-day-reached");
        }

        var violations = validator.validate(transaction);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("transaction.invalid", violations);
        }

        return transactionRepository.save(transaction);
    }

    @Nonnull
    public Page<Transaction> transactionsOfProfile(@Nonnull Profile profile,
                                                   @Nonnull Pageable pageable,
                                                   OffsetDateTime from,
                                                   OffsetDateTime to) {
        return transactionsOfProfile(profile, pageable, from, to, null, null);
    }

    @Nonnull
    public Page<Transaction> transactionsOfProfile(@Nonnull Profile profile,
                                                   @Nonnull Pageable pageable,
                                                   OffsetDateTime from,
                                                   OffsetDateTime to,
                                                   List<String> categoriesCodes,
                                                   List<String> walletsCodes) {
        var categoriesIds = categoryService.idsOfCodes(profile, categoriesCodes);
        var walletsIds = walletService.idsOfCodes(profile, walletsCodes);
        var specification = TransactionSpec.withProfile(profile)
            .and(TransactionSpec.datetimeBetween(from, to))
            .and(TransactionSpec.withCategories(categoriesIds))
            .and(TransactionSpec.withWallets(walletsIds));
        return transactionRepository.findAll(specification, pageable);
    }

    @Nonnull
    public TransactionsStats getStats(@Nonnull Profile profile,
                                      @Nonnull OffsetDateTime from,
                                      @Nonnull OffsetDateTime to) {
        return getStats(profile, from, to, null, null);
    }

    @Nonnull
    public TransactionsStats getStats(@Nonnull Profile profile,
                                      @Nonnull OffsetDateTime from,
                                      @Nonnull OffsetDateTime to,
                                      List<String> categoriesCodes,
                                      List<String> walletsCodes) {
        var categoriesIds = categoryService.idsOfCodes(profile, categoriesCodes);
        var walletsIds = walletService.idsOfCodes(profile, walletsCodes);
        var specification = TransactionSpec.withProfile(profile)
            .and(TransactionSpec.datetimeBetween(from, to))
            .and(TransactionSpec.withCategories(categoriesIds))
            .and(TransactionSpec.withWallets(walletsIds));
        var transactions = transactionRepository
            .findAll(specification, Sort.by(Sort.Direction.DESC, "datetime", "id"));
        return TransactionsStats.build(from, to, transactions);
    }

    public Optional<Transaction> transactionOfProfileByCode(@Nonnull Profile profile,
                                                            @Nonnull String code) {
        return transactionRepository.findByProfileAndCode(profile, code);
    }
}
