package com.zp1ke.flo.api;

import com.intuit.karate.junit5.Karate;
import com.zp1ke.flo.api.controller.v1.AuthController;
import com.zp1ke.flo.api.model.UserCreateRequest;
import com.zp1ke.flo.data.domain.Category;
import com.zp1ke.flo.data.domain.Wallet;
import com.zp1ke.flo.data.service.CategoryService;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import com.zp1ke.flo.data.service.WalletService;
import java.time.LocalDate;
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
    CategoryService categoryService;

    @Autowired
    WalletService walletService;

    @Autowired
    AuthController authController;

    @Karate.Test
    Karate testFeatures() {
        var username = "karate-user";
        var userRequest = new UserCreateRequest(username + "@mail.com", username, "12345678");
        var user = userService.create(userRequest.toUser(), userRequest.toProfile());
        userService.verifyUserByCode(user.getVerifyCode());

        var profiles = profileService.profilesOfUser(user);
        var profile = profiles.getFirst();
        var profileCode = profile.getCode();
        var token = authController.generateToken(user, "127.0.0.1");

        var mainCategory = categoryService.save(Category.builder()
            .profile(profile)
            .name("test main category")
            .build());

        var mainWallet = walletService.save(Wallet.builder()
            .profile(profile)
            .name("test main wallet")
            .build());

        var today = LocalDate.now();
        var todayDate = String.format("%04d-%02d-%02d", today.getYear(), today.getMonthValue(), today.getDayOfMonth());

        return Karate
            .run("classpath:features/")
            .relativeTo(getClass())
            .systemProperty("baseUrl", "http://localhost:" + serverPort)
            .systemProperty("profileCode", profileCode)
            .systemProperty("username", username)
            .systemProperty("authToken", token)
            .systemProperty("todayDate", todayDate)
            .systemProperty("mainCategoryCode", mainCategory.getCode())
            .systemProperty("mainWalletCode", mainWallet.getCode());
    }
}
