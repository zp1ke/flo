package com.zp1ke.flo.api.model;

import java.util.Date;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JwtToken {
    private final String token;

    private final Date expirationDate;
}
