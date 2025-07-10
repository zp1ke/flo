package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.model.FileContent;
import org.jetbrains.annotations.NotNull;

public class NoneStorageHandler implements StorageHandler {
    @Override
    public void deleteFile(@NotNull String code) {
        // No operation for NoneStorageHandler
    }

    @Override
    public void saveFile(@NotNull String code, @NotNull FileContent fileContent) {
        // No operation for NoneStorageHandler
    }
}
