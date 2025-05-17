package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import com.zp1ke.flo.data.model.TransactionsStats;
import com.zp1ke.flo.data.repository.TransactionRepository;
import com.zp1ke.flo.data.repository.TransactionSpec;
import com.zp1ke.flo.data.util.DomainUtils;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final Validator validator;

    private final TransactionRepository transactionRepository;

    private final CategoryService categoryService;

    private final WalletService walletService;

    @NonNull
    public Transaction save(@NonNull Transaction transaction) {
        if (StringUtils.isBlank(transaction.getCode())) {
            transaction.setCode(DomainUtils
                .generateRandomCode((code) -> transactionRepository.existsByProfileAndCode(transaction.getProfile(), code)));
        }

        var violations = validator.validate(transaction);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("transaction.invalid", violations);
        }

        return transactionRepository.save(transaction);
    }

    @NonNull
    public Page<Transaction> transactionsOfProfile(@NonNull Profile profile,
                                                   @NonNull Pageable pageable,
                                                   @Nullable OffsetDateTime from,
                                                   @Nullable OffsetDateTime to) {
        return transactionsOfProfile(profile, pageable, from, to, null, null);
    }

    @NonNull
    public Page<Transaction> transactionsOfProfile(@NonNull Profile profile,
                                                   @NonNull Pageable pageable,
                                                   @Nullable OffsetDateTime from,
                                                   @Nullable OffsetDateTime to,
                                                   @Nullable List<String> categoriesCodes,
                                                   @Nullable List<String> walletsCodes) {
        var categoriesIds = categoryService.idsOfCodes(profile, categoriesCodes);
        var walletsIds = walletService.idsOfCodes(profile, walletsCodes);
        var specification = TransactionSpec.withProfile(profile)
            .and(TransactionSpec.datetimeBetween(from, to))
            .and(TransactionSpec.withCategories(categoriesIds))
            .and(TransactionSpec.withWallets(walletsIds));
        return transactionRepository.findAll(specification, pageable);
    }

    @NonNull
    public TransactionsStats getStats(@NonNull Profile profile,
                                      @NonNull OffsetDateTime from,
                                      @NonNull OffsetDateTime to) {
        return getStats(profile, from, to, null, null);
    }

    @NonNull
    public TransactionsStats getStats(@NonNull Profile profile,
                                      @NonNull OffsetDateTime from,
                                      @NonNull OffsetDateTime to,
                                      @Nullable List<String> categoriesCodes,
                                      @Nullable List<String> walletsCodes) {
        var categoriesIds = categoryService.idsOfCodes(profile, categoriesCodes);
        var walletsIds = walletService.idsOfCodes(profile, walletsCodes);
        var specification = TransactionSpec.withProfile(profile)
            .and(TransactionSpec.datetimeBetween(from, to))
            .and(TransactionSpec.withCategories(categoriesIds))
            .and(TransactionSpec.withWallets(walletsIds));
        var transactions = transactionRepository.findAll(specification);
        return TransactionsStats.build(from, to, transactions);
    }

    public Optional<Transaction> transactionOfProfileByCode(@NonNull Profile profile,
                                                            @NonNull String code) {
        return transactionRepository.findByProfileAndCode(profile, code);
    }
}
