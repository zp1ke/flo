package com.zp1ke.flo.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.zp1ke.flo")
public class FloApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(FloApiApplication.class, args);
    }
}
