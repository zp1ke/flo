package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.handler.impl.CsvHandler;
import com.zp1ke.flo.tools.model.ExportData;
import com.zp1ke.flo.tools.model.ExportFormat;
import com.zp1ke.flo.tools.model.Mappables;
import jakarta.annotation.Nonnull;
import java.util.Map;

public interface Exporter {

    /**
     * Exports a collection of mappables to a byte array based on the specified export format.
     *
     * @param mappables the collection of mappables to export
     * @param format    the export format to use
     * @return an ExportData object containing the exported data
     */
    @Nonnull
    static ExportData export(@Nonnull Mappables mappables, @Nonnull ExportFormat format) {
        var exporter = exporterFor(format);
        var data = exporter.export(mappables);
        return new ExportData(data, format);
    }

    @Nonnull
    private static Exporter exporterFor(@Nonnull ExportFormat format) {
        return switch (format) {
            case CSV -> new CsvHandler();
        };
    }

    /**
     * Exports a collection of mappables to a byte array.
     *
     * @param mappables the collection of mappables to export
     * @return a map where keys are mappable names and values are their exported byte arrays
     */
    @Nonnull
    Map<String, byte[]> export(@Nonnull Mappables mappables);
}
