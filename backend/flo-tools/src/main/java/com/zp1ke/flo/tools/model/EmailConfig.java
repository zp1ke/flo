package com.zp1ke.flo.tools.model;

import com.zp1ke.flo.utils.StringUtils;
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

    public boolean isNotValid() {
        return sender == null || sender.isNotValid() || StringUtils.isBlank(host) || port <= 0;
    }
}
