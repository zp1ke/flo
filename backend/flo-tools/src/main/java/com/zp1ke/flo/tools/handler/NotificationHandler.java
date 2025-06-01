package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.model.EmailNotification;

public interface NotificationHandler {
    void sendEmail(EmailNotification notification);
}
