package com.zp1ke.flo.tools.handler.impl;

import com.zp1ke.flo.tools.handler.Exporter;
import com.zp1ke.flo.tools.model.Mappable;
import com.zp1ke.flo.tools.model.Mappables;
import jakarta.annotation.Nonnull;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CsvHandler implements Exporter {
    private final static String SEPARATOR = ",";

    private final static String ESCAPE = "\"";

    @Override
    @Nonnull
    public Map<String, byte[]> export(@Nonnull Mappables mappables) {
        var data = new HashMap<String, byte[]>();

        var keys = mappables.keySet();
        for (var key : keys) {
            var mappableList = mappables.get(key);
            data.put(key, bytesOf(mappableList));
        }
        return data;
    }

    @Nonnull
    private byte[] bytesOf(@Nonnull List<? extends Mappable> mappables) {
        if (mappables.isEmpty()) {
            return new byte[0];
        }

        var properties = mappables.getFirst().getProperties();
        var builder = new StringBuilder(String.join(",", properties))
            .append("\n");
        for (var mappable : mappables) {
            builder.append(toCsv(properties, mappable)).append("\n");
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Nonnull
    private String toCsv(@Nonnull List<String> properties, @Nonnull Mappable mappable) {
        var builder = new StringBuilder();
        for (var property : properties) {
            var value = mappable.getValue(property);
            if (value != null) {
                builder.append(sanitize(value));
            }
            builder.append(",");
        }
        var row = builder.toString();
        return row.endsWith(",") ? row.substring(0, row.length() - 1) : row;
    }

    @Nonnull
    private String sanitize(@Nonnull String value) {
        var result = value;
        if (result.contains(SEPARATOR) || result.contains(ESCAPE)) {
            if (!result.startsWith(ESCAPE)) {
                result = ESCAPE + result;
            }
            if (!result.endsWith(ESCAPE)) {
                result = result + ESCAPE;
            }
        }
        return result;
    }
}
