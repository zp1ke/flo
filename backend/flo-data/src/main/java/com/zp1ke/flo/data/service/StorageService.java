package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.repository.StorageFileRepository;
import com.zp1ke.flo.tools.error.StorageException;
import com.zp1ke.flo.tools.handler.StorageHandler;
import com.zp1ke.flo.tools.model.FileContent;
import jakarta.annotation.Nonnull;
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
     * @param filesContent the list of file contents to save
     * @return a list of saved StorageFile objects
     * @throws StorageException if there is an error during file storage
     */
    public List<StorageFile> saveFiles(@Nonnull User user,
                                       @Nonnull List<FileContent> filesContent) throws StorageException {
        var files = new ArrayList<StorageFile>(filesContent.size());
        for (var fileContent : filesContent) {
            files.add(saveFile(user, fileContent));
        }
        return files;
    }

    /**
     * Saves a file for the given user.
     *
     * @param user        the user who owns the file
     * @param fileContent the content of the file to save
     * @return the saved StorageFile object
     * @throws StorageException if there is an error during file storage
     */
    public StorageFile saveFile(@Nonnull User user,
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
            .build();
        return storageFileRepository.save(file);
    }
}
