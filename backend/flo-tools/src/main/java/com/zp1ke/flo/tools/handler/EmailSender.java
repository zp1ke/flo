package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.impl.AngusEmailSender;
import com.zp1ke.flo.tools.handler.impl.MailgunEmailSender;
import com.zp1ke.flo.tools.handler.impl.NoneEmailSender;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailHandler;
import com.zp1ke.flo.tools.model.EmailNotification;

public interface EmailSender {

    static EmailSender create(EmailHandler handler, EmailConfig config) {
        if (handler == null || config == null || config.isNotValid()) {
            return new NoneEmailSender();
        }

        return switch (handler) {
            case NONE -> new NoneEmailSender();
            case SMTP -> new AngusEmailSender(config);
            case MAILGUN -> new MailgunEmailSender(config);
        };
    }

    void sendEmail(EmailNotification notification) throws EmailException;
}
