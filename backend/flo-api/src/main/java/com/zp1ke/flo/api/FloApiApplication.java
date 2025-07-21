package com.zp1ke.flo.api;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.zp1ke.flo")
public class FloApiApplication {

    @Value("${spring.application.timezone:UTC}")
    private String timeZone;

    public static void main(String[] args) {
        SpringApplication.run(FloApiApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
    }
}
