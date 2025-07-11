package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.error.TemplateException;
import com.zp1ke.flo.data.model.StorageFileAttachment;
import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Attachment;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailNotification;
import jakarta.annotation.Nonnull;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final EmailSender emailSender;

    private final MessageService messageService;

    private final StorageService storageService;

    @Value("${web.baseUrl:}")
    private String webBaseUrl;

    @Value("${web.logoImageUrl:}")
    private String logoImageUrl;

    public void sendVerificationLink(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-verification-email";
            var actionLinkKey = "verify";
            sendUserActionEmail(user, profile, templateCode, actionLinkKey);
        } catch (Exception e) {
            throw new EmailException("Error sending verification email to " + user.getEmail(), e);
        }
    }

    public void sendRecoveryLink(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-recovery-email";
            var actionLinkKey = "recovery";
            sendUserActionEmail(user, profile, templateCode, actionLinkKey);
        } catch (Exception e) {
            throw new EmailException("Error sending recovery email to " + user.getEmail(), e);
        }
    }

    public void sendVerificationCode(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-verification-code-email";
            sendUserEmail(user, profile, templateCode);
        } catch (Exception e) {
            throw new EmailException("Error sending verification code email to " + user.getEmail(), e);
        }
    }

    public void sendData(@Nonnull User user,
                         @Nonnull Profile profile,
                         @Nonnull List<StorageFile> files) throws EmailException {
        try {
            var templateCode = "user-data-email";
            sendUserActionEmail(user, profile, templateCode, null, files);
        } catch (Exception e) {
            throw new EmailException("Error sending data email to " + user.getEmail(), e);
        }
    }

    public void sendDataError(@Nonnull User user,
                              @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-data-error-email";
            sendUserEmail(user, profile, templateCode);
        } catch (Exception e) {
            throw new EmailException("Error sending data error email to " + user.getEmail(), e);
        }
    }

    private void sendUserEmail(@Nonnull User user,
                               @Nonnull Profile profile,
                               @Nonnull String templateCode) throws EmailException, TemplateException {
        sendUserActionEmail(user, profile, templateCode, null, null);
    }

    private void sendUserActionEmail(@Nonnull User user,
                                     @Nonnull Profile profile,
                                     @Nonnull String templateCode,
                                     String actionLinkKey) throws EmailException, TemplateException {
        sendUserActionEmail(user, profile, templateCode, actionLinkKey, null);
    }

    private void sendUserActionEmail(@Nonnull User user,
                                     @Nonnull Profile profile,
                                     @Nonnull String templateCode,
                                     String actionLinkKey,
                                     List<StorageFile> attachments) throws EmailException, TemplateException {
        var locale = profile.getLocale();
        var subject = messageService
            .message(templateCode + "-subject", new String[] {profile.getName()}, locale);
        var data = new HashMap<>(Map.of(
            "user", user,
            "profile", profile,
            "logoImageUrl", logoImageUrl
        ));
        if (actionLinkKey != null) {
            data.put("actionLink", String.format("%s/%s/%s", webBaseUrl, actionLinkKey, user.getVerifyCode()));
        }
        var recipient = Contact.builder()
            .email(user.getEmail())
            .name(profile.getName())
            .build();
        sendEmail(templateCode, locale, subject, recipient, data, attachments);
    }

    private void sendEmail(@Nonnull String template,
                           @Nonnull Locale locale,
                           @Nonnull String subject,
                           @Nonnull Contact recipient,
                           @Nonnull Map<String, Object> data,
                           List<StorageFile> attachments) throws EmailException, TemplateException {
        var body = messageService.template(template + ".ftlh", data, locale);
        var emailAttachments = attachments != null ? attachments.stream()
            .map(attachment -> new StorageFileAttachment(attachment, storageService))
            .map(attachment -> (Attachment) attachment)
            .toList() : null;
        var builder = EmailNotification.builder()
            .subject(subject)
            .body(body)
            .html(true)
            .recipient(recipient)
            .attachments(emailAttachments);
        var notification = builder.build();
        emailSender.sendEmail(notification);
    }
}
