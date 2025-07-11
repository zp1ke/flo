package com.zp1ke.flo.tools.model;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailNotification {
    private final String subject;

    private final String body;

    private final boolean html;

    private final Contact recipient;

    private final List<Attachment> attachments;
}
