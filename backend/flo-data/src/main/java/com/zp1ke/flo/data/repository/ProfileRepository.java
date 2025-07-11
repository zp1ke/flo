package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {

    boolean existsByUserAndCodeAndEnabledTrue(@Nonnull User user, @Nonnull String code);

    Optional<Profile> findByUserAndCodeAndEnabledTrue(@Nonnull User user, @Nonnull String code);

    List<Profile> findAllByUserAndEnabledTrue(@Nonnull User user);

    boolean existsByUserAndNameAndEnabledTrue(@Nonnull User user, @Nonnull String name);

    Integer countByUserAndEnabledTrue(@Nonnull User user);

    boolean existsByUserAndNameAndIdNotAndEnabledTrue(@Nonnull User user, @Nonnull String name, @Nonnull Long id);

    Optional<Profile> findTopByUserAndEnabledTrueOrderByCreatedAtAsc(@Nonnull User user);
}
