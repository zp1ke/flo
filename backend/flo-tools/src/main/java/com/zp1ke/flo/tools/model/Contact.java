package com.zp1ke.flo.tools.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Contact {
    private final String name;

    private final String email;
}
