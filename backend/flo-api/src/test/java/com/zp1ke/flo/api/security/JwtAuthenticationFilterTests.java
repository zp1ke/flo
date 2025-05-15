package com.zp1ke.flo.api.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class JwtAuthenticationFilterTests {
    @Test
    void testPathRequiresProfile() {
        var path = "/api/v1/profiles";
        assertFalse(JwtAuthenticationFilter.pathRequiresProfile(path));

        path = "/api/v1/profiles/FXHG3792";
        assertTrue(JwtAuthenticationFilter.pathRequiresProfile(path));

        path = "/api/v1/profiles/FXHG3792/categories";
        assertTrue(JwtAuthenticationFilter.pathRequiresProfile(path));
    }

    @Test
    void testProfileCodeOf() {
        var path = "/api/v1/profiles";
        assertNull(JwtAuthenticationFilter.profileCodeOf(path));

        var profileCode = "FXHG3792";

        path = "/api/v1/profiles/" + profileCode;
        assertEquals(profileCode, JwtAuthenticationFilter.profileCodeOf(path));

        path = "/api/v1/profiles/" + profileCode + "/categories";
        assertEquals(profileCode, JwtAuthenticationFilter.profileCodeOf(path));
    }
}
