package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserExport;
import jakarta.annotation.Nonnull;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserExportRepository extends JpaRepository<UserExport, Long> {

    @Query("SELECT COUNT(DISTINCT ue.code) FROM UserExport ue" +
        " WHERE ue.user = :user" +
        " AND ue.createdAt BETWEEN :start AND :end")
    long countDistinctCodeByUserAndCreatedAtBetween(@Nonnull User user,
                                                    @Nonnull OffsetDateTime start,
                                                    @Nonnull OffsetDateTime end);
}
