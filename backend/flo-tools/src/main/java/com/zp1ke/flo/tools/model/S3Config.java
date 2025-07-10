package com.zp1ke.flo.tools.model;

import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import java.net.URI;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.regions.Region;

@Getter
@Builder
@Slf4j
public class S3Config {

    private String endpoint;

    private String accessKey;

    private String secretKey;

    private String bucket;

    private String region;

    @Nonnull
    public Region s3Region() {
        try {
            return Region.of(region);
        } catch (Exception e) {
            log.warn("Invalid AWS region '{}', defaulting to us-east-2", region, e);
            return Region.US_EAST_2;
        }
    }

    @Nonnull
    public AwsCredentialsProvider s3CredentialsProvider() {
        return () -> AwsBasicCredentials.create(accessKey, secretKey);
    }

    public URI s3Endpoint() {
        if (StringUtils.isNotBlank(endpoint)) {
            return URI.create(endpoint);
        }
        return null;
    }
}
