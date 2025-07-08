package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailNotification;
import com.zp1ke.flo.utils.StringUtils;
import io.mailtrap.client.MailtrapClient;
import io.mailtrap.config.MailtrapConfig;
import io.mailtrap.factory.MailtrapClientFactory;
import io.mailtrap.model.request.emails.Address;
import io.mailtrap.model.request.emails.MailtrapMail;
import jakarta.annotation.Nonnull;
import java.util.List;
import org.jetbrains.annotations.NotNull;

public class MailtrapEmailSender implements EmailSender {

    private final EmailConfig config;

    private final MailtrapClient client;

    public MailtrapEmailSender(@Nonnull EmailConfig config) {
        var builder = new MailtrapConfig.Builder()
            .sandbox(config.isSandbox())
            .token(config.getPassword());
        if (config.isSandbox()) {
            try {
                builder.inboxId(Long.parseLong(config.getUsername()));
            } catch (NumberFormatException ignored) {
            }
        }
        var mailtrapConfig = builder.build();

        this.config = config;
        client = MailtrapClientFactory.createMailtrapClient(mailtrapConfig);
    }

    @Override
    public boolean hasValidConfig() {
        if (config.isSandbox()) {
            try {
                Long.parseLong(config.getUsername());
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return config.getSender() != null && config.getSender().isValid() &&
            StringUtils.isNotBlank(config.getPassword());
    }

    @Override
    public void sendEmail(@NotNull EmailNotification notification) throws EmailException {
        var builder = MailtrapMail.builder()
            .from(toAddress(config.getSender()))
            .to(List.of(toAddress(notification.getRecipient())))
            .subject(notification.getSubject());
        if (notification.isHtml()) {
            builder.html(notification.getBody());
        } else {
            builder.text(notification.getBody());
        }
        var mail = builder.build();
        try {
            client.send(mail);
        } catch (Exception e) {
            throw new EmailException(e.getMessage(), e);
        }
    }

    @Nonnull
    private Address toAddress(@Nonnull Contact contact) {
        return new Address(contact.getEmail(), contact.getName());
    }
}
