package com.zp1ke.flo.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class IoUtilsTests {

    @Test
    void testToBytes() throws IOException {
        String input = "Hello, World!";
        try (var inputStream = new ByteArrayInputStream(input.getBytes())) {
            var result = IoUtils.toBytes(inputStream);
            assertArrayEquals(input.getBytes(), result);
        }
    }
}