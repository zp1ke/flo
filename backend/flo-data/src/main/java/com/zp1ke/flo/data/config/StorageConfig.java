package com.zp1ke.flo.data.config;

import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.handler.impl.NoneStorageHandler;
import com.zp1ke.flo.utils.StringUtils;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class StorageConfig {

    @Value("${storage.endpoint:}")
    private String endpoint;

    @Value("${storage.accessKey:}")
    private String accessKey;

    @Value("${storage.secretKey:}")
    private String secretKey;

    @Value("${storage.bucket:}")
    private String bucket;

    @Bean
    StorageHandler storageHandler() {
        if (StringUtils.isNotBlank(accessKey) && StringUtils.isNotBlank(secretKey) && StringUtils.isNotBlank(bucket)) {
            // TODO: S3StorageHandler
        }
        return new NoneStorageHandler();
    }
}
