package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByTokenAndUserAndRemoteAddress(@NonNull String token,
                                                           @NonNull User user,
                                                           @NonNull String remoteAddress);

    Optional<UserToken> findByTokenAndUser(@NonNull String token, @NonNull User user);

    void deleteByTokenAndRemoteAddress(@NonNull String token, @NonNull String remoteAddress);
}
