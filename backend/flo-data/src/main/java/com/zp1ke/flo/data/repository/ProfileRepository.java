package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {

    boolean existsByUserAndCode(@Nonnull User user, @Nonnull String code);

    Optional<Profile> findByUserAndCode(@Nonnull User user, @Nonnull String code);

    List<Profile> findAllByUser(@Nonnull User user);

    boolean existsByUserAndName(@NotNull User user, @Nonnull String name);

    Integer countByUser(@Nonnull User user);

    boolean existsByUserAndNameAndIdNot(@Nonnull User user, @Nonnull String name, @Nonnull Long id);

    Optional<Profile> findTopByUserOrderByCreatedAtAsc(@Nonnull User user);
}
