package com.zp1ke.flo.tools.handler.impl;

import com.mailgun.api.v3.MailgunMessagesApi;
import com.mailgun.client.MailgunClient;
import com.mailgun.model.message.Message;
import com.mailgun.util.EmailUtil;
import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailNotification;
import com.zp1ke.flo.utils.StringUtils;
import feign.FeignException;
import feign.Logger;
import feign.Request;
import feign.Retryer;
import feign.codec.ErrorDecoder;
import jakarta.annotation.Nonnull;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MailgunEmailSender implements EmailSender {

    private static final String DEFAULT_BASE_URL = "https://api.mailgun.net/";

    private final EmailConfig config;

    private final MailgunMessagesApi api;

    public MailgunEmailSender(@Nonnull EmailConfig config) {
        var baseUrl = StringUtils.isNotBlank(config.getHost()) ? config.getHost() : DEFAULT_BASE_URL;
        this.config = config;
        api = MailgunClient
            .config(baseUrl, config.getPassword())
            .logLevel(Logger.Level.BASIC)
            .retryer(new Retryer.Default())
            .logger(new Logger.NoOpLogger())
            .errorDecoder(new ErrorDecoder.Default())
            .options(new Request.Options(10, TimeUnit.SECONDS, 60, TimeUnit.SECONDS, true))
            .createApi(MailgunMessagesApi.class);
    }

    @Override
    public boolean hasValidConfig() {
        return config.getSender() != null && config.getSender().isValid() &&
            StringUtils.isNotBlank(config.getUsername()) && StringUtils.isNotBlank(config.getPassword());
    }

    @Override
    public void sendEmail(@Nonnull EmailNotification notification) throws EmailException {
        var message = Message.builder()
            .from(EmailUtil.nameWithEmail(config.getSender().getName(), config.getSender().getEmail()))
            .to(EmailUtil.nameWithEmail(notification.getRecipient().getName(), notification.getRecipient().getEmail()))
            .subject(notification.getSubject())
            .html(notification.getBody())
            .build();
        try {
            api.sendMessage(config.getUsername(), message);
        } catch (FeignException e) {
            log.error("Failed to send email via Mailgun: status {} - {}", e.status(), e.getMessage(), e);
            throw new EmailException(e.getMessage(), e);
        }
    }
}
