package com.zp1ke.flo.data.config;

import com.zp1ke.flo.data.domain.User;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserAuditorAware implements AuditorAware<User> {

    @Override
    @Nonnull
    public Optional<User> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return Optional.of(user);
        }
        return Optional.empty();
    }
}
