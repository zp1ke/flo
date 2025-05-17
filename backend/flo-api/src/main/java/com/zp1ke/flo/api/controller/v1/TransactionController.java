package com.zp1ke.flo.api.controller.v1;

import com.zp1ke.flo.api.dto.PageDto;
import com.zp1ke.flo.api.dto.TransactionDto;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.TransactionService;
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
}
