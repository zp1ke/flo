package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(@NonNull String username);

    Optional<User> findByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);

    boolean existsByUsername(@NonNull String username);

    Optional<User> findByVerifyCode(@NonNull String code);
}
