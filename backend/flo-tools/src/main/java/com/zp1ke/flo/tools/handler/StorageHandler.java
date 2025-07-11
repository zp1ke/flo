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
     * @throws StorageException if there is an error saving the file.
     */
    void saveFile(@Nonnull String code, @Nonnull FileContent fileContent) throws StorageException;

    /**
     * Retrieves the content of a file with the given code.
     *
     * @param code Unique identifier for the file.
     * @return Content of the file as a byte array.
     * @throws StorageException if there is an error retrieving the file content.
     */
    @Nonnull
    byte[] contentOf(@Nonnull String code) throws StorageException;
}
