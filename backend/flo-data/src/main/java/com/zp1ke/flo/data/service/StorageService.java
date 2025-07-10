package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.domain.StorageFile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.repository.StorageFileRepository;
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
     */
    public List<StorageFile> saveFiles(@Nonnull User user,
                                       @Nonnull List<FileContent> filesContent) {
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
     */
    public StorageFile saveFile(@Nonnull User user,
                                @Nonnull FileContent fileContent) {
        var code = fileCode(user, fileContent.name());

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

    @Nonnull
    private String fileCode(@Nonnull User user, @Nonnull String name) {
        var code = String.format("%s_%s", user.getId(), name);
        if (code.length() > 255) {
            code = code.substring(0, 255);
        }
        return code;
    }
}
