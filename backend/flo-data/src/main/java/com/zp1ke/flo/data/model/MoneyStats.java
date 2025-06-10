package com.zp1ke.flo.data.model;

import jakarta.annotation.Nonnull;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class MoneyStats {

    private final BigDecimal income;

    private final BigDecimal outcome;

    private final BigDecimal balance;

    protected static MoneyStats empty() {
        return MoneyStats.builder()
            .income(BigDecimal.ZERO)
            .outcome(BigDecimal.ZERO)
            .balance(BigDecimal.ZERO)
            .build();
    }

    /**
     * Adds the given amount to the current stats.
     *
     * @param amount the amount to add
     * @return a new instance of {@link MoneyStats} with the updated values
     */
    protected MoneyStats add(@Nonnull BigDecimal amount) {
        var balance = this.balance.add(amount);
        var income = this.income;
        var outcome = this.outcome;
        if (amount.compareTo(BigDecimal.ZERO) > 0) {
            income = income.add(amount);
        } else {
            outcome = outcome.add(amount);
        }
        return MoneyStats.builder()
            .income(income)
            .outcome(outcome)
            .balance(balance)
            .build();
    }
}
