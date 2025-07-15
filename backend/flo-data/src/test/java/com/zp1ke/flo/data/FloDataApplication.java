package com.zp1ke.flo.data;

import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.handler.impl.NoneEmailSender;
import com.zp1ke.flo.tools.handler.impl.NoneStorageHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(scanBasePackages = "com.zp1ke.flo")
public class FloDataApplication {
    public static void main(String[] args) {
        SpringApplication.run(FloDataApplication.class, args);
    }

    @Bean
    public EmailSender emailSender() {
        return new NoneEmailSender();
    }

    @Bean
    public StorageHandler storageHandler() {
        return new NoneStorageHandler();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
