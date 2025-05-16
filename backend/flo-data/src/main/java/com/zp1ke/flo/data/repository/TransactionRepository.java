package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
