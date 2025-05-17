package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Wallet;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    boolean existsByProfileAndName(@NonNull Profile profile, @NonNull String name);

    boolean existsByProfileAndNameAndIdNot(@NonNull Profile profile, @NonNull String name, @NonNull Long id);

    int countByProfileIn(@NonNull List<Profile> profiles);

    boolean existsByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    Optional<Wallet> findByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    List<Wallet> findAllByProfile(@NonNull Profile profile);

    List<Wallet> findAllByProfileAndCodeIn(@NonNull Profile profile, @NonNull List<String> codes);
}
