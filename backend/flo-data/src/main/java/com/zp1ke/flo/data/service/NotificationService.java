package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.User;
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

    public void sendVerificationEmail(@NonNull User user) {
        jobScheduler.enqueue(() -> doSendVerificationEmail(user));
    }

    @Job
    public void doSendVerificationEmail(@NonNull User user) throws InterruptedException {
        // TODO: Implement the actual email sending logic here with NotificationHandler
        log.info("The sendVerificationEmail job has begun. The user you passed is {}", user.getEmail());
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            log.error("Error while executing sendVerificationEmail {} job", user.getEmail(), e);
            throw e;
        } finally {
            log.info("SendVerificationEmail {} job has finished!", user.getEmail());
        }
    }
}
