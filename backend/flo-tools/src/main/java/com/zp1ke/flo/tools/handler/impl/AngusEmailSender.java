package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailNotification;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

/**
 * Implementation of {@link EmailSender} that uses the Angus Mail API to send emails.
 * This class is responsible for configuring the mail session and sending email notifications.
 */
public class AngusEmailSender implements EmailSender {

    private final Properties properties;

    private final EmailConfig config;

    public AngusEmailSender(@Nonnull EmailConfig config) {
        properties = new Properties();
        properties.put("mail.smtp.starttls.enable", String.valueOf(config.isUseTLS()));
        properties.put("mail.smtp.host", config.getHost());
        properties.put("mail.smtp.port", config.getPort());
        properties.put("mail.smtp.ssl.trust", config.getHost());
        if (StringUtils.isNotBlank(config.getUsername())) {
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.user", config.getUsername());
            properties.put("mail.smtp.password", config.getPassword());
        }
        this.config = config;
    }

    @Override
    public boolean hasValidConfig() {
        var host = properties.getProperty("mail.smtp.host");
        var port = Integer.parseInt(properties.getProperty("mail.smtp.port", "0"));
        return config.getSender() != null && config.getSender().isValid() && StringUtils.isNotBlank(host) && port > 0;
    }

    @Override
    public void sendEmail(@Nonnull EmailNotification notification) throws EmailException {
        try {
            var message = new MimeMessage(createSession());
            message.setFrom(toInternetAddress(config.getSender()));
            message.setRecipients(Message.RecipientType.TO,
                new InternetAddress[] {toInternetAddress(notification.getRecipient())});
            message.setSubject(notification.getSubject());

            var mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(notification.getBody(), "text/html; charset=utf-8");

            var multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);
            Transport.send(message);
        } catch (Exception e) {
            throw new EmailException("Failed to send email", e);
        }
    }

    @Nonnull
    private InternetAddress toInternetAddress(@Nonnull Contact contact) throws UnsupportedEncodingException {
        return new InternetAddress(contact.getEmail(), contact.getName());
    }

    @Nonnull
    private Session createSession() {
        Authenticator authenticator = null;
        if (StringUtils.isNotBlank(config.getUsername()) && StringUtils.isNotBlank(config.getPassword())) {
            authenticator = new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(config.getUsername(), config.getPassword());
                }
            };
        }
        return Session.getInstance(properties, authenticator);
    }
}
