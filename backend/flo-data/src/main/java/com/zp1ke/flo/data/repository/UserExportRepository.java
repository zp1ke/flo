package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserExport;
import jakarta.annotation.Nonnull;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserExportRepository extends JpaRepository<UserExport, Long> {

    long countDistinctCodeByUserIdAndCreatedAtBetween(@Nonnull User user,
                                                      @Nonnull OffsetDateTime start,
                                                      @Nonnull OffsetDateTime end);
}
