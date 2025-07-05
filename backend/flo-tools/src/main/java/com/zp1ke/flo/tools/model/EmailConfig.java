package com.zp1ke.flo.tools.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailConfig {
    private final String host;

    private final int port;

    private final String username;

    private final String password;

    private final boolean useSSL;

    private final boolean useTLS;

    private final Contact sender;
}
