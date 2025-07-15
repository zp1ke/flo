package com.zp1ke.flo.data;

import org.springframework.boot.SpringApplication;

public class TestFloDataApplication {
    public static void main(String[] args) {
        SpringApplication.from(FloDataApplication::main).with(TestcontainersConfig.class).run(args);
    }
}
