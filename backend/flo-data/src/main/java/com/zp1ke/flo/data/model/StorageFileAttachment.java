package com.zp1ke.flo.data.model;

import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.service.StorageService;
import com.zp1ke.flo.tools.error.StorageException;
import com.zp1ke.flo.tools.model.Attachment;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class StorageFileAttachment implements Attachment {

    private final StorageFile file;

    private final StorageService service;

    @Nonnull
    @Override
    public String getId() {
        return file.getCode();
    }

    @Nonnull
    @Override
    public String getFilename() {
        return file.getName();
    }

    @Override
    public boolean isInline() {
        return false;
    }

    @Nonnull
    @Override
    public byte[] getContent() throws StorageException {
        return service.contentOf(file);
    }
}
