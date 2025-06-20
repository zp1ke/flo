package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    boolean existsByProfileAndNameAndEnabledTrue(@Nonnull Profile profile, @Nonnull String name);

    boolean existsByProfileAndNameAndIdNotAndEnabledTrue(@Nonnull Profile profile, @Nonnull String name, @Nonnull Long id);

    int countByEnabledTrueAndProfileIn(@Nonnull List<Profile> profiles);

    boolean existsByProfileAndCodeAndEnabledTrue(@Nonnull Profile profile, @Nonnull String code);

    Optional<Category> findByProfileAndCodeAndEnabledTrue(@Nonnull Profile profile, @Nonnull String code);

    List<Category> findAllByProfileAndEnabledTrueAndCodeIn(@Nonnull Profile profile, @Nonnull List<String> codes);

    boolean existsByProfileAndEnabledTrue(@Nonnull Profile profile);
}
