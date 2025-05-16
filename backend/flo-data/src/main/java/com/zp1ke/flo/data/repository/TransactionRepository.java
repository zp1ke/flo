package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    boolean existsByProfileAndCode(@NonNull Profile profile, @NonNull String code);
}
