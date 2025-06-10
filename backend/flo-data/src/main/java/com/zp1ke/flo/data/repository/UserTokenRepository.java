package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserToken;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByTokenAndUserAndRemoteAddress(@Nonnull String token,
                                                           @Nonnull User user,
                                                           @Nonnull String remoteAddress);

    Optional<UserToken> findByTokenAndUser(@Nonnull String token, @Nonnull User user);

    void deleteByTokenAndRemoteAddress(@Nonnull String token, @Nonnull String remoteAddress);
}
