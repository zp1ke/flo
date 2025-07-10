package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.error.StorageException;
import com.zp1ke.flo.tools.model.FileContent;
import jakarta.annotation.Nonnull;

public interface StorageHandler {
    /**
     * Deletes a file with the given code.
     *
     * @param code Unique identifier for the file.
     */
    void deleteFile(@Nonnull String code);

    /**
     * Saves a file with the given code and content.
     *
     * @param code        Unique identifier for the file.
     * @param fileContent Content of the file to be saved.
     */
    void saveFile(@Nonnull String code, @Nonnull FileContent fileContent) throws StorageException;
}
