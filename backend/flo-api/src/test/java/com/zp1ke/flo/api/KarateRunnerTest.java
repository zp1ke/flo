package com.zp1ke.flo.api;

import com.intuit.karate.junit5.Karate;
import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.security.JwtTokenProvider;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@Import(TestcontainersConfig.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class KarateRunnerTest {

    @LocalServerPort
    String serverPort;

    @Autowired
    UserService userService;

    @Autowired
    ProfileService profileService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Karate.Test
    Karate testFeatures() {
        var username = "karate-user";
        var userDto = UserDto.builder()
            .username(username)
            .email(username + "@mail.com")
            .password("12345678")
            .build();
        var user = userService.create(userDto.toUser());

        var profiles = profileService.profilesOfUser(user);
        var profileCode = profiles.getFirst().getCode();
        var token = jwtTokenProvider.generateToken(user.getUsername());

        return Karate
            .run("classpath:features/")
            .relativeTo(getClass())
            .systemProperty("baseUrl", "http://localhost:" + serverPort)
            .systemProperty("profileCode", profileCode)
            .systemProperty("username", username)
            .systemProperty("authToken", token);
    }
}
