package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Setting;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.SettingCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface SettingRepository extends JpaRepository<Setting, Long> {

    boolean existsByCodeAndUser(@NonNull SettingCode code, @NonNull User user);

    Optional<Setting> findByCodeAndUser(@NonNull SettingCode code, @NonNull User user);
}
