package com.zp1ke.flo.data.config;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.model.UserProfile;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserAuditorAware implements AuditorAware<UserProfile> {

    @Override
    @NonNull
    public Optional<UserProfile> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserProfile userProfile) {
                return Optional.of(userProfile);
            }
            if (authentication.getPrincipal() instanceof User user) {
                return Optional.of(new UserProfile(user, null));
            }
            if (authentication.getPrincipal() instanceof Profile profile) {
                return Optional.of(new UserProfile(profile.getUser(), profile));
            }
        }
        return Optional.empty();
    }
}
