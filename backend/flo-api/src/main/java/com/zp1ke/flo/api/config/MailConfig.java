package com.zp1ke.flo.api.config;

import com.zp1ke.flo.tools.handler.EmailSender;
import com.zp1ke.flo.tools.model.EmailConfig;
import com.zp1ke.flo.tools.model.EmailHandler;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MailConfig {

    @Value("${mail.handler:NONE}")
    private EmailHandler handler;

    @Value("${mail.host:}")
    private String host;

    @Value("${mail.port:0}")
    private int port;

    @Value("${mail.username:}")
    private String username;

    @Value("${mail.password:}")
    private String password;

    @Value("${mail.useSSL:false}")
    private boolean useSSL;

    @Value("${mail.useTLS:true}")
    private boolean useTLS;

    @Value("${mail.senderEmail:info@flo.app}")
    private String senderEmail;

    @Value("${mail.senderName:Flo App}")
    private String senderName;

    @Bean
    public EmailSender emailSender() {
        var emailConfig = EmailConfig.builder()
            .host(host)
            .port(port)
            .username(username)
            .password(password)
            .useSSL(useSSL)
            .useTLS(useTLS)
            .build();
        return EmailSender.create(handler, emailConfig);
    }
}
