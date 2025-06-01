package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailNotification;

public class MailgunEmailSender implements EmailSender {

    public MailgunEmailSender(EmailConfig config) {
    }

    @Override
    public void sendEmail(EmailNotification notification) throws EmailException {
        // TODO: Implement the actual email sending logic here using Mailgun API
    }
}
