package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.error.StorageException;
import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.model.FileContent;
import com.zp1ke.flo.tools.model.S3Config;
import jakarta.annotation.Nonnull;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

// https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/home.html
@Slf4j
public class S3StorageHandler implements StorageHandler {
    private final S3Client client;

    private final String bucket;

    public S3StorageHandler(@Nonnull S3Config config) {
        client = S3Client.builder()
            .credentialsProvider(config.s3CredentialsProvider())
            .region(config.s3Region())
            .endpointOverride(config.s3Endpoint())
            .build();
        bucket = config.getBucket();
    }

    @Override
    public void deleteFile(@NotNull String code) {
        var request = DeleteObjectRequest.builder()
            .bucket(bucket)
            .key(code)
            .build();
        try {
            client.deleteObject(request);
        } catch (Exception e) {
            log.warn("Failed to delete file from S3: {}", code, e);
        }
    }

    @Override
    public void saveFile(@NotNull String code, @NotNull FileContent fileContent) throws StorageException {
        var request = PutObjectRequest.builder()
            .bucket(bucket)
            .key(code)
            .metadata(Map.of(
                "filename", fileContent.name()
            ))
            .build();
        try {
            client.putObject(request, RequestBody.fromBytes(fileContent.content()));
        } catch (Exception e) {
            throw new StorageException(e.getMessage(), e);
        }
    }
}
