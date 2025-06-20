package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameAndEnabledTrue(@Nonnull String username);

    Optional<User> findByEmailAndEnabledTrue(@Nonnull String email);

    boolean existsByEmailAndEnabledTrue(@Nonnull String email);

    boolean existsByUsernameAndEnabledTrue(@Nonnull String username);

    Optional<User> findByVerifyCodeAndEnabledTrue(@Nonnull String code);
}
