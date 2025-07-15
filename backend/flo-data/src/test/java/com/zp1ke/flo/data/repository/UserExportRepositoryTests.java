package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.TestcontainersConfig;
import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.domain.UserExport;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Import(TestcontainersConfig.class)
@SpringBootTest
public class UserExportRepositoryTests {

    @Autowired
    UserExportRepository userExportRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StorageFileRepository storageFileRepository;

    @Test
    void testCountDistinctCodeByUserIdAndCreatedAtBetween() {
        var user = User.builder()
            .email("test@mail.com")
            .username("testUser")
            .password("testPassword")
            .enabled(true)
            .verifyCode("testVerifyCode")
            .build();
        user = userRepository.save(user);

        var now = OffsetDateTime.now();
        var expiresAt = now.plusDays(1);
        var filesCount = 5;
        var files = new ArrayList<StorageFile>();
        for (var index = 0; index < filesCount; index++) {
            var file = StorageFile.builder()
                .user(user)
                .name("file-" + index)
                .expiresAt(expiresAt)
                .sizeInBytes(index * 1000L)
                .build();
            files.add(storageFileRepository.save(file));
        }

        var code = "testCode";
        for (var file : files) {
            var userExport = UserExport.builder()
                .user(user)
                .code(code)
                .file(file)
                .expiresAt(expiresAt)
                .build();
            userExportRepository.save(userExport);
        }

        var count = userExportRepository.countDistinctCodeByUserIdAndCreatedAtBetween(
            user,
            OffsetDateTime.now().withDayOfMonth(1),
            OffsetDateTime.now().plusMonths(1).withDayOfMonth(1));
        assertEquals(1, count);
    }
}
