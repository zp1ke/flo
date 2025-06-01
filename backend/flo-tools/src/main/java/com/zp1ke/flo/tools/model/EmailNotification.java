package com.zp1ke.flo.tools.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailNotification {
    private final String subject;

    private final String body;

    private final Contact sender;

    private final Contact recipient;
}
