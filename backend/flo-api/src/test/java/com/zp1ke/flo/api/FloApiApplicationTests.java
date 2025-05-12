package com.zp1ke.flo.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfig.class)
@SpringBootTest
class FloApiApplicationTests {

    @Test
    void contextLoads() {
    }
}
