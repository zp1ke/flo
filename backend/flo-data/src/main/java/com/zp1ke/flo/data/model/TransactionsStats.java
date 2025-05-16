package com.zp1ke.flo.data.model;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Transaction;
import com.zp1ke.flo.data.domain.Wallet;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.NonNull;

@Getter
@SuperBuilder
public class TransactionsStats extends MoneyStats {
    private final OffsetDateTime from;

    private final OffsetDateTime to;

    private final List<GroupStats> categories;

    private final List<GroupStats> wallets;

    private final List<Transaction> transactions;

    @NonNull
    public static TransactionsStats build(@NonNull OffsetDateTime from,
                                          @NonNull OffsetDateTime to,
                                          @NonNull List<Transaction> transactions) {
        var categoriesMap = Map.<Category, MoneyStats>of();
        var walletsMap = Map.<Wallet, MoneyStats>of();
        var stats = MoneyStats.empty();
        for (var transaction : transactions) {
            categoriesMap = addToMap(transaction.getCategory(), transaction.getAmount(), categoriesMap);
            walletsMap = addToMap(transaction.getWallet(), transaction.getAmount(), walletsMap);
            stats = stats.add(transaction.getAmount());
        }

        var categories = mapToGroupsStats(categoriesMap, Category::getCode, Category::getName);
        var wallets = mapToGroupsStats(walletsMap, Wallet::getCode, Wallet::getName);
        return TransactionsStats.builder()
            .from(from)
            .to(to)
            .categories(categories)
            .wallets(wallets)
            .income(stats.getIncome())
            .outcome(stats.getOutcome())
            .balance(stats.getBalance())
            .transactions(transactions)
            .build();
    }

    @NonNull
    private static <T> List<GroupStats> mapToGroupsStats(@NonNull Map<T, MoneyStats> map,
                                                         @NonNull Function<T, String> codeMapper,
                                                         @NonNull Function<T, String> nameMapper) {
        return map.entrySet().stream()
            .<GroupStats>map(entry -> GroupStats.builder()
                .code(codeMapper.apply(entry.getKey()))
                .name(nameMapper.apply(entry.getKey()))
                .income(entry.getValue().getIncome())
                .outcome(entry.getValue().getOutcome())
                .balance(entry.getValue().getBalance())
                .build())
            .toList();
    }

    @NonNull
    private static <T> Map<T, MoneyStats> addToMap(@NonNull T key,
                                                   @NonNull BigDecimal amount,
                                                   @NonNull Map<T, MoneyStats> map) {
        var theMap = new HashMap<>(map);
        var value = theMap.getOrDefault(key, MoneyStats.empty());
        value = value.add(amount);
        theMap.put(key, value);
        return theMap;
    }
}
