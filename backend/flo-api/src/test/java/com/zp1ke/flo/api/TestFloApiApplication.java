package com.zp1ke.flo.api;

import org.springframework.boot.SpringApplication;

public class TestFloApiApplication {
    public static void main(String[] args) {
        SpringApplication.from(FloApiApplication::main).with(TestcontainersConfig.class).run(args);
    }
}
