package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailNotification;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.annotations.Job;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
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

    public void sendVerificationEmail(@NonNull User user, @NonNull Profile profile) {
        jobScheduler.enqueue(() -> doSendVerificationEmail(user, profile));
    }

    @Job
    public void doSendVerificationEmail(@NonNull User user, @NonNull Profile profile) throws EmailException {
        try {
            var templateCode = "user-verification-email";
            var locale = profile.getLocale();
            var subject = messageService
                .message(templateCode + "-subject", new String[] {profile.getName()}, locale);
            var data = Map.<String, Object>of(
                "user", user,
                "profile", profile,
                "verificationLink", String.format("%s/verify/%s", webBaseUrl, user.getVerifyCode())
            );
            var body = messageService
                .template(templateCode + ".ftl", data, locale);
            var notification = EmailNotification.builder()
                .subject(subject)
                .body(body)
                .recipient(Contact.builder()
                    .email(user.getEmail())
                    .name(profile.getName())
                    .build())
                .build();
            emailSender.sendEmail(notification);
        } catch (Exception e) {
            throw new EmailException("Error sending verification email to " + user.getEmail(), e);
        }
    }
}
