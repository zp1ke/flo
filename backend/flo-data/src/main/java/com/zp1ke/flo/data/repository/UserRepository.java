package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(@Nonnull String username);

    Optional<User> findByEmail(@Nonnull String email);

    boolean existsByEmail(@Nonnull String email);

    boolean existsByUsername(@Nonnull String username);

    Optional<User> findByVerifyCode(@Nonnull String code);
}
