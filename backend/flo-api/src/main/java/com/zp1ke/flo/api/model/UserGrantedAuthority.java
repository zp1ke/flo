package com.zp1ke.flo.api.model;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@RequiredArgsConstructor
public class UserGrantedAuthority implements GrantedAuthority {
    private final UserAuthority authority;

    @Override
    public String getAuthority() {
        return authority.name();
    }
}
