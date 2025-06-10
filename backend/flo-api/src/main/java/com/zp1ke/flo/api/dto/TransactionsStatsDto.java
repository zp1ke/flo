package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.model.GroupStats;
import com.zp1ke.flo.data.model.MoneyStats;
import com.zp1ke.flo.data.model.TransactionsStats;
import jakarta.annotation.Nonnull;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class TransactionsStatsDto extends MoneyStats {

    private final OffsetDateTime from;

    private final OffsetDateTime to;

    private final List<GroupStats> categories;

    private final List<GroupStats> wallets;

    private final List<TransactionDto> transactions;

    @Nonnull
    public static TransactionsStatsDto fromStats(@Nonnull TransactionsStats stats) {
        var transactions = stats.getTransactions().stream()
            .map(TransactionDto::fromTransaction)
            .toList();
        return TransactionsStatsDto.builder()
            .from(stats.getFrom())
            .to(stats.getTo())
            .categories(stats.getCategories())
            .wallets(stats.getWallets())
            .transactions(transactions)
            .income(stats.getIncome())
            .outcome(stats.getOutcome())
            .balance(stats.getBalance())
            .build();
    }
}
