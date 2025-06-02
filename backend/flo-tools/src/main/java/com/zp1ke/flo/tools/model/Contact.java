package com.zp1ke.flo.tools.model;

import com.zp1ke.flo.utils.StringUtils;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Contact {
    private final String name;

    private final String email;

    public boolean isNotValid() {
        return StringUtils.isBlank(name) || StringUtils.isNotEmail(email);
    }
}
