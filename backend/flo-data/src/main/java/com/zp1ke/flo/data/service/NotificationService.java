package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.error.TemplateException;
import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailNotification;
import jakarta.annotation.Nonnull;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.annotations.Job;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JobScheduler jobScheduler;

    private final EmailSender emailSender;

    private final MessageService messageService;

    @Value("${web.baseUrl:}")
    private String webBaseUrl;

    @Value("${web.logoImageUrl:}")
    private String logoImageUrl;

    public void sendVerificationLink(@Nonnull User user, @Nonnull Profile profile) {
        jobScheduler.enqueue(() -> doSendVerificationLink(user, profile));
    }

    public void sendRecoveryLink(@Nonnull User user, @Nonnull Profile profile) {
        jobScheduler.enqueue(() -> doSendRecoveryLink(user, profile));
    }

    public void sendVerificationCode(@Nonnull User user, @Nonnull Profile profile) {
        jobScheduler.enqueue(() -> doSendVerificationCode(user, profile));
    }

    @Job
    public void doSendVerificationLink(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-verification-email";
            var actionLinkKey = "verify";
            sendUserActionEmail(user, profile, templateCode, actionLinkKey);
        } catch (Exception e) {
            throw new EmailException("Error sending verification email to " + user.getEmail(), e);
        }
    }

    @Job
    public void doSendRecoveryLink(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-recovery-email";
            var actionLinkKey = "recovery";
            sendUserActionEmail(user, profile, templateCode, actionLinkKey);
        } catch (Exception e) {
            throw new EmailException("Error sending recovery email to " + user.getEmail(), e);
        }
    }

    @Job
    public void doSendVerificationCode(@Nonnull User user, @Nonnull Profile profile) throws EmailException {
        try {
            var templateCode = "user-verification-code-email";
            sendUserActionEmail(user, profile, templateCode, null);
        } catch (Exception e) {
            throw new EmailException("Error sending verification code email to " + user.getEmail(), e);
        }
    }

    private void sendUserActionEmail(@Nonnull User user,
                                     @Nonnull Profile profile,
                                     @Nonnull String templateCode,
                                     String actionLinkKey) throws EmailException, TemplateException {
        var locale = profile.getLocale();
        var subject = messageService
            .message(templateCode + "-subject", new String[] {profile.getName()}, locale);
        var data = new HashMap<>(Map.<String, Object>of(
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
        sendEmail(templateCode, locale, subject, recipient, data);
    }

    private void sendEmail(@Nonnull String template,
                           @Nonnull Locale locale,
                           @Nonnull String subject,
                           @Nonnull Contact recipient,
                           @Nonnull Map<String, Object> data) throws EmailException, TemplateException {
        var body = messageService
            .template(template + ".ftl", data, locale);
        var notification = EmailNotification.builder()
            .subject(subject)
            .body(body)
            .recipient(recipient)
            .build();
        emailSender.sendEmail(notification);
    }
}
