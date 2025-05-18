package com.zp1ke.flo.api.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zp1ke.flo.api.TestcontainersConfig;
import com.zp1ke.flo.api.dto.UserDto;
import com.zp1ke.flo.api.model.AuthRequest;
import com.zp1ke.flo.api.model.AuthResponse;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@Import(TestcontainersConfig.class)
@SpringBootTest
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Test
    void signup_returnsAuthResponse_whenRegistrationIsSuccessful() throws Exception {
        var userDto = UserDto.builder()
            .email("newuser@example.com")
            .username("new-user")
            .password("password123")
            .build();
        var requestBody = objectMapper.writeValueAsString(userDto);

        var result = mockMvc.perform(post("/api/v1/auth/sign-up")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andReturn();

        var response = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(response);
        assertNotNull(response.token());

        var savedUser = userService.findByEmailOrUsername(userDto.getEmail());
        assertNotNull(savedUser);
    }

    @Test
    void signup_returnsBadRequest_whenEmailAlreadyExists() throws Exception {
        var existingUser = User.builder()
            .email("existing@example.com")
            .password("password123")
            .build();
        userService.create(existingUser);

        var userDto = UserDto.builder()
            .email(existingUser.getEmail())
            .password("anotherpassword")
            .build();
        var requestBody = objectMapper.writeValueAsString(userDto);

        mockMvc.perform(post("/api/v1/auth/sign-up")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    void signin_returnsAuthResponse_whenCredentialsAreValid() throws Exception {
        var password = "password123";
        var user = User.builder()
            .email("user@example.com")
            .password(password)
            .build();
        userService.create(user);

        var authRequest = new AuthRequest(user.getEmail(), password);
        var requestBody = objectMapper.writeValueAsString(authRequest);

        var result = mockMvc.perform(post("/api/v1/auth/sign-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andReturn();

        var response = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(response);
        assertNotNull(response.token());
    }

    @Test
    void signin_returnsBadRequest_whenUserDoesNotExist() throws Exception {
        var authRequest = new AuthRequest("nonexistent@example.com", "password123");
        var requestBody = objectMapper.writeValueAsString(authRequest);

        mockMvc.perform(post("/api/v1/auth/sign-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    void signin_returnsBadRequest_whenPasswordIsIncorrect() throws Exception {
        var user = User.builder()
            .email("user2@example.com")
            .password("correctpassword")
            .build();
        userService.create(user);

        var authRequest = new AuthRequest(user.getEmail(), "wrongpassword");
        var requestBody = objectMapper.writeValueAsString(authRequest);

        mockMvc.perform(post("/api/v1/auth/sign-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }
}