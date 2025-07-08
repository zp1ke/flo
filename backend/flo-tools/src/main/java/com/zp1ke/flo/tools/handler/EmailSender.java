package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.impl.AngusEmailSender;
import com.zp1ke.flo.tools.handler.impl.MailtrapEmailSender;
import com.zp1ke.flo.tools.handler.impl.NoneEmailSender;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailHandler;
import com.zp1ke.flo.tools.model.EmailNotification;
import jakarta.annotation.Nonnull;

/**
 * Email sender interface for sending email notifications.
 */
public interface EmailSender {

    /**
     * Creates an instance of {@link EmailSender} based on the provided handler and configuration.
     *
     * @param handler the email handler type
     * @param config  the email configuration
     * @return an instance of {@link EmailSender}
     */
    @Nonnull
    static EmailSender create(@Nonnull EmailHandler handler, @Nonnull EmailConfig config) {
        var sender = switch (handler) {
            case NONE -> new NoneEmailSender();
            case SMTP -> new AngusEmailSender(config);
            case MAILTRAP -> new MailtrapEmailSender(config);
        };
        if (!sender.hasValidConfig()) {
            return new NoneEmailSender();
        }
        return sender;
    }

    /**
     * Checks if the email sender has a valid configuration.
     *
     * @return true if the configuration is valid, false otherwise
     */
    boolean hasValidConfig();

    /**
     * Sends an email notification.
     *
     * @param notification the email notification to send
     * @throws EmailException if an error occurs while sending the email
     */
    void sendEmail(@Nonnull EmailNotification notification) throws EmailException;
}
