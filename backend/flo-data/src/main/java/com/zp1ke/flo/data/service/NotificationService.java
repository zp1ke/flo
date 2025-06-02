package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.tools.error.EmailException;
import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.Contact;
import com.zp1ke.flo.tools.model.EmailNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.annotations.Job;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JobScheduler jobScheduler;

    private final EmailSender emailSender;

    public void sendVerificationEmail(@NonNull User user, @NonNull Profile profile) {
        jobScheduler.enqueue(() -> doSendVerificationEmail(user, profile));
    }

    @Job
    public void doSendVerificationEmail(@NonNull User user, @NonNull Profile profile) throws EmailException {
        var notification = EmailNotification.builder()
            .subject("Email Verification TODO: Add subject here")
            .body("Please verify your email address by clicking the link below. TODO: Add verification link here.")
            .recipient(Contact.builder()
                .email(user.getEmail())
                .name(profile.getName())
                .build())
            .build();
        emailSender.sendEmail(notification);
    }
}
