package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    boolean existsByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    Optional<Transaction> findByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    long countByCreatedAtBetweenAndProfileIn(@NonNull OffsetDateTime from,
                                             @NonNull OffsetDateTime to,
                                             @NonNull List<Profile> profiles);
}
