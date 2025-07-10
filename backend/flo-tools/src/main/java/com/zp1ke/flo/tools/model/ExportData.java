package com.zp1ke.flo.tools.model;

import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ExportData {

    private final Map<String, byte[]> data;

    private final ExportFormat format;

    /**
     * Returns the list of file contents generated from the export data.
     *
     * @return a list of FileContent objects, each containing the file name and its byte content
     */
    @Nonnull
    public List<FileContent> getFiles() {
        return data.entrySet().stream()
            .map(entry -> new FileContent(fileName(entry.getKey()), entry.getValue()))
            .toList();
    }

    @Nonnull
    private String fileName(@Nonnull String code) {
        return code + "." + format.name().toLowerCase();
    }

    public int size() {
        return data.size();
    }

    /**
     * Checks if the export data contains a file with the given key.
     *
     * @param key the key to check
     * @return true if the key exists, false otherwise
     */
    public boolean containsKey(String key) {
        return data.containsKey(key);
    }

    /**
     * Retrieves the file content for the given key.
     *
     * @param key the key of the file
     * @return the byte array of the file content, or null if not found
     */
    public byte[] get(String key) {
        return data.get(key);
    }
}
