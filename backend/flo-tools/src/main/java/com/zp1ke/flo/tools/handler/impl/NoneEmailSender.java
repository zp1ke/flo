package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.EmailNotification;
import jakarta.annotation.Nonnull;

public class NoneEmailSender implements EmailSender {

    @Override
    public void sendEmail(@Nonnull EmailNotification notification) {
        // No operation for NoneEmailSender
        // This is a placeholder implementation that does nothing
        // It can be used when no email sending is configured or needed
    }
}
