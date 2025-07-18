package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.repository.StorageFileRepository;
import com.zp1ke.flo.tools.error.StorageException;
import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.model.FileContent;
import jakarta.annotation.Nonnull;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final StorageHandler storageHandler;

    private final StorageFileRepository storageFileRepository;

    /**
     * Saves multiple files for the given user.
     *
     * @param user         the user who owns the files
     * @param expiresAt    the expiration time for the files
     * @param filesContent the list of file contents to save
     * @return a list of saved StorageFile objects
     * @throws StorageException if there is an error during file storage
     */
    public List<StorageFile> saveFiles(@Nonnull User user,
                                       @Nonnull OffsetDateTime expiresAt,
                                       @Nonnull List<FileContent> filesContent) throws StorageException {
        var files = new ArrayList<StorageFile>(filesContent.size());
        for (var fileContent : filesContent) {
            files.add(saveFile(user, expiresAt, fileContent));
        }
        return files;
    }

    /**
     * Saves a file for the given user.
     *
     * @param user        the user who owns the file
     * @param expiresAt   the expiration time for the file
     * @param fileContent the content of the file to save
     * @return the saved StorageFile object
     * @throws StorageException if there is an error during file storage
     */
    public StorageFile saveFile(@Nonnull User user,
                                @Nonnull OffsetDateTime expiresAt,
                                @Nonnull FileContent fileContent) throws StorageException {
        var code = fileContent.codeFor(user.getId().toString());

        storageHandler.deleteFile(code);
        storageHandler.saveFile(code, fileContent);

        var fileBuilder = storageFileRepository.findByCode(code)
            .orElse(new StorageFile())
            .toBuilder();
        var file = fileBuilder
            .code(code)
            .name(fileContent.name())
            .user(user)
            .sizeInBytes((long) fileContent.content().length)
            .expiresAt(expiresAt)
            .build();
        return storageFileRepository.save(file);
    }

    /**
     * Retrieves the content of a file by its code.
     *
     * @param file the file
     * @return the content of the file as a byte array
     * @throws StorageException if there is an error retrieving the file
     */
    @Nonnull
    public byte[] contentOf(@Nonnull StorageFile file) throws StorageException {
        return storageHandler.contentOf(file.getCode());
    }
}
