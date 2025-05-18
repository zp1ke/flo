package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.PageDto;
import com.zp1ke.flo.api.dto.TransactionDto;
import com.zp1ke.flo.api.dto.TransactionsStatsDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.CategoryService;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.TransactionService;
import com.zp1ke.flo.data.service.WalletService;
import com.zp1ke.flo.utils.DateTimeUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles/{profileCode}/transactions")
@RequiredArgsConstructor
@Tag(name = "transactions", description = "Profile transactions")
public class TransactionController {

    private final ProfileService profileService;

    private final TransactionService transactionService;

    private final CategoryService categoryService;

    private final WalletService walletService;

    @GetMapping
    @Operation(summary = "Get transactions")
    public ResponseEntity<PageDto<TransactionDto>> getTransactions(@AuthenticationPrincipal User user,
                                                                   @PathVariable String profileCode,
                                                                   @PageableDefault(sort = "datetime", direction = Sort.Direction.DESC)
                                                                   Pageable pageable,
                                                                   @RequestParam(required = false, name = "from")
                                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                   @RequestParam(required = false, name = "to")
                                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var from = DateTimeUtils.toOffsetDateTime(fromDate);
            var to = toDate != null ? DateTimeUtils.toOffsetDateTime(toDate.plusDays(1)) : null;
            var transactions = transactionService.transactionsOfProfile(profile.get(), pageable, from, to);
            return ResponseEntity.ok(PageDto.of(transactions, TransactionDto::fromTransaction));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    @Operation(summary = "Add transaction data")
    public ResponseEntity<TransactionDto> addTransaction(@AuthenticationPrincipal User user,
                                                         @PathVariable String profileCode,
                                                         @RequestBody TransactionDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var transaction = request.toTransaction(profile.get(), categoryService, walletService);
            var saved = transactionService.save(transaction);
            var dto = TransactionDto.fromTransaction(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/{transactionCode}")
    @Operation(summary = "Update transaction data")
    public ResponseEntity<TransactionDto> updateTransaction(@AuthenticationPrincipal User user,
                                                            @PathVariable String profileCode,
                                                            @PathVariable String transactionCode,
                                                            @RequestBody TransactionDto request) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var transaction = transactionService.transactionOfProfileByCode(profile.get(), transactionCode);
            if (transaction.isPresent()) {
                var transactionToUpdate = transaction.get().toBuilder()
                    .description(request.getDescription())
                    .datetime(request.getDatetime())
                    .amount(request.getAmount())
                    .category(categoryService.categoryOfProfileByCode(profile.get(), request.getCategoryCode()).orElse(null))
                    .wallet(walletService.walletOfProfileByCode(profile.get(), request.getWalletCode()).orElse(null))
                    .build();
                var saved = transactionService.save(transactionToUpdate);
                var dto = TransactionDto.fromTransaction(saved);
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Get transactions stats")
    public ResponseEntity<TransactionsStatsDto> getStats(@AuthenticationPrincipal User user,
                                                         @PathVariable String profileCode,
                                                         @RequestParam(name = "from")
                                                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                         @RequestParam(name = "to")
                                                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        var profile = profileService.profileOfUserByCode(user, profileCode);
        if (profile.isPresent()) {
            var from = DateTimeUtils.toOffsetDateTime(fromDate);
            var to = DateTimeUtils.toOffsetDateTime(toDate.plusDays(1));
            var stats = transactionService.getStats(profile.get(), from, to);
            var dto = TransactionsStatsDto.fromStats(stats);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
