package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Setting;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, Long> {

    boolean existsByCodeAndUser(@Nonnull SettingCode code, @Nonnull User user);

    Optional<Setting> findByCodeAndUser(@Nonnull SettingCode code, @Nonnull User user);
}
