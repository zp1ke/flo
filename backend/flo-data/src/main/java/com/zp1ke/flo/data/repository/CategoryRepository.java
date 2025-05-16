package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Profile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByProfileAndName(@NonNull Profile profile, @NonNull String name);

    boolean existsByProfileAndNameAndIdNot(@NonNull Profile profile, @NonNull String name, @NonNull Long id);

    int countByProfileIn(@NonNull List<Profile> profiles);

    boolean existsByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    Optional<Category> findByProfileAndCode(@NonNull Profile profile, @NonNull String code);

    List<Category> findAllByProfile(@NonNull Profile profile);

    List<Category> findAllByProfileAndCodeIn(@NonNull Profile profile, @NonNull List<String> codes);
}
