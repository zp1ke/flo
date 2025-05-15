package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    boolean existsByUserAndCode(@NonNull User user, @NonNull String code);

    Optional<Profile> findByUserAndCode(@NonNull User user, @NonNull String code);

    List<Profile> findAllByUser(@NonNull User user);

    boolean existsByUserAndName(@NotNull User user, @NonNull String name);

    Integer countByUser(@NonNull User user);

    boolean existsByUserAndNameAndIdNot(@NonNull User user, @NonNull String name, @NonNull Long id);
}
