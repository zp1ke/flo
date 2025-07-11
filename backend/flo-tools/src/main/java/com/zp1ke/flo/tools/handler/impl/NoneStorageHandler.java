package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.model.FileContent;
import jakarta.annotation.Nonnull;

public class NoneStorageHandler implements StorageHandler {
    @Override
    public void deleteFile(@Nonnull String code) {
        // No operation for NoneStorageHandler
    }

    @Override
    public void saveFile(@Nonnull String code, @Nonnull FileContent fileContent) {
        // No operation for NoneStorageHandler
    }

    @Override
    @Nonnull
    public byte[] contentOf(@Nonnull String code) {
        return new byte[0];
    }
}
