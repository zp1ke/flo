package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.Wallet;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WalletRepository extends JpaRepository<Wallet, Long>, JpaSpecificationExecutor<Wallet> {

    boolean existsByProfileAndNameAndEnabledTrue(@Nonnull Profile profile, @Nonnull String name);

    boolean existsByProfileAndNameAndIdNotAndEnabledTrue(@Nonnull Profile profile, @Nonnull String name, @Nonnull Long id);

    int countByEnabledTrueAndProfileIn(@Nonnull List<Profile> profiles);

    boolean existsByProfileAndCodeAndEnabledTrue(@Nonnull Profile profile, @Nonnull String code);

    Optional<Wallet> findByProfileAndCodeAndEnabledTrue(@Nonnull Profile profile, @Nonnull String code);

    List<Wallet> findAllByProfileAndCodeInAndEnabledTrue(@Nonnull Profile profile, @Nonnull List<String> codes);

    boolean existsByProfileAndEnabledTrue(@Nonnull Profile profile);
}
