package com.zp1ke.flo.tools.model;

import com.zp1ke.flo.tools.error.StorageException;
import jakarta.annotation.Nonnull;

public interface Attachment {

    @Nonnull
    String getId();

    @Nonnull
    String getFilename();

    boolean isInline();

    @Nonnull
    byte[] getContent() throws StorageException;
}
