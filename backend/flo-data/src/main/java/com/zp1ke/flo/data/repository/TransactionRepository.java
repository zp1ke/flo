package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import com.zp1ke.flo.data.domain.Wallet;
import jakarta.annotation.Nonnull;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    boolean existsByProfileAndCode(@Nonnull Profile profile, @Nonnull String code);

    Optional<Transaction> findByProfileAndCode(@Nonnull Profile profile, @Nonnull String code);

    long countByCreatedAtBetweenAndProfileIn(@Nonnull OffsetDateTime from,
                                             @Nonnull OffsetDateTime to,
                                             @Nonnull List<Profile> profiles);

    long countByCategory(@Nonnull Category category);

    long countByWallet(@Nonnull Wallet wallet);

    boolean existsByProfile(@Nonnull Profile profile);

    List<Transaction> findAllByProfileIn(@Nonnull List<Profile> profiles);

    Optional<Transaction> findTopByWalletAndDatetimeBeforeAndWalletBalanceAfterNotNullAndEnabledTrueOrderByDatetimeDesc(@Nonnull Wallet wallet,
                                                                                                                        @Nonnull OffsetDateTime datetime);

    List<Transaction> findAllByWalletAndDatetimeAfterAndEnabledTrueOrderByDatetimeAsc(@Nonnull Wallet wallet,
                                                                                      @Nonnull OffsetDateTime datetime);
}
