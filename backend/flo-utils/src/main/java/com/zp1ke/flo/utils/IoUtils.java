package com.zp1ke.flo.utils;

import jakarta.annotation.Nonnull;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class IoUtils {

    /**
     * Reads all bytes from the given InputStream and returns them as a byte array.
     *
     * @param inputStream the InputStream to read from
     * @return a byte array containing all bytes read from the InputStream
     * @throws IOException if an I/O error occurs while reading from the InputStream
     */
    @Nonnull
    public static byte[] toBytes(@Nonnull InputStream inputStream) throws IOException {
        var output = new ByteArrayOutputStream();
        inputStream.transferTo(output);
        return output.toByteArray();
    }
}
