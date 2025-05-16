package com.zp1ke.flo.data.model;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class GroupStats extends MoneyStats {

    private final String code;

    private final String name;
}
