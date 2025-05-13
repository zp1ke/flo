package com.zp1ke.flo.api.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JwtAuthenticationFilterTests {
    @Test
    void testPathRequiresProfile() {
        var path = "/api/v1/profiles/FXHG3792";
        assertTrue(JwtAuthenticationFilter.pathRequiresProfile(path));
    }
}
