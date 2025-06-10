package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Wallet;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    boolean existsByProfileAndName(@Nonnull Profile profile, @Nonnull String name);

    boolean existsByProfileAndNameAndIdNot(@Nonnull Profile profile, @Nonnull String name, @Nonnull Long id);

    int countByProfileIn(@Nonnull List<Profile> profiles);

    boolean existsByProfileAndCode(@Nonnull Profile profile, @Nonnull String code);

    Optional<Wallet> findByProfileAndCode(@Nonnull Profile profile, @Nonnull String code);

    List<Wallet> findAllByProfile(@Nonnull Profile profile);

    List<Wallet> findAllByProfileAndCodeIn(@Nonnull Profile profile, @Nonnull List<String> codes);
}
