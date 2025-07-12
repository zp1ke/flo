package com.zp1ke.flo.api.config;

import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.handler.impl.NoneStorageHandler;
import com.zp1ke.flo.tools.handler.impl.S3StorageHandler;
import com.zp1ke.flo.tools.model.S3Config;
import com.zp1ke.flo.utils.StringUtils;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Slf4j
public class StorageConfig {

    @Value("${storage.endpoint:}")
    private String endpoint;

    @Value("${storage.accessKey:}")
    private String accessKey;

    @Value("${storage.secretKey:}")
    private String secretKey;

    @Value("${storage.bucket:}")
    private String bucket;

    @Value("${storage.region:us-east-2}")
    private String region;

    @Bean
    StorageHandler storageHandler() {
        StorageHandler handler = null;
        if (StringUtils.isNotBlank(accessKey) && StringUtils.isNotBlank(secretKey) && StringUtils.isNotBlank(bucket)) {
            var s3Config = S3Config.builder()
                .endpoint(endpoint)
                .accessKey(accessKey)
                .secretKey(secretKey)
                .bucket(bucket)
                .region(region)
                .build();
            handler = new S3StorageHandler(s3Config);
        }
        if (handler == null) {
            handler = new NoneStorageHandler();
        }
        log.debug(" ============ Storage Handler initialized: {}", handler.getClass().getSimpleName());
        return handler;
    }
}
