package com.zp1ke.flo.tools.handler;

import com.zp1ke.flo.tools.model.ExportFormat;
import com.zp1ke.flo.tools.model.Mappable;
import com.zp1ke.flo.tools.model.Mappables;
import jakarta.annotation.Nonnull;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ExporterTests {

    @Test
    void testCsvExporter() {
        var mappables = new Mappables();
        mappables.put("test", List.of(
            new TestMappable("value1", "value2"),
            new TestMappable("valueA", "valueB")
        ));

        var data = Exporter.export(mappables, ExportFormat.CSV);
        assertEquals(1, data.size());
        assertTrue(data.containsKey("test"));

        var csv = new String(data.get("test")).split("\n");
        assertEquals(3, csv.length);
        assertTrue(csv[0].contains("property1,property2"));
        assertTrue(csv[1].contains("value1,value2"));
        assertTrue(csv[2].contains("valueA,valueB"));
    }

    @Test
    void testCsvExporterWithSeparator() {
        var mappables = new Mappables();
        mappables.put("test", List.of(
            new TestMappable("value1,A", "value2"),
            new TestMappable("valueA", "valueB,2")
        ));

        var data = Exporter.export(mappables, ExportFormat.CSV);
        assertEquals(1, data.size());
        assertTrue(data.containsKey("test"));

        var csv = new String(data.get("test")).split("\n");
        assertEquals(3, csv.length);
        assertTrue(csv[0].contains("property1,property2"));
        assertTrue(csv[1].contains("\"value1,A\",value2"));
        assertTrue(csv[2].contains("valueA,\"valueB,2\""));
    }

    @Test
    void testCsvExporterWithEscape() {
        var mappables = new Mappables();
        mappables.put("test", List.of(
            new TestMappable("value\"1", "value2"),
            new TestMappable("valueA", "valueB")
        ));

        var data = Exporter.export(mappables, ExportFormat.CSV);
        assertEquals(1, data.size());
        assertTrue(data.containsKey("test"));

        var csv = new String(data.get("test")).split("\n");
        assertEquals(3, csv.length);
        assertTrue(csv[0].contains("property1,property2"));
        assertTrue(csv[1].contains("\"value\"1\",value2"));
        assertTrue(csv[2].contains("valueA,valueB"));
    }

    private static class TestMappable implements Mappable {
        private final String property1;

        private final String property2;

        private TestMappable(@Nonnull String property1, @Nonnull String property2) {
            this.property1 = property1;
            this.property2 = property2;
        }

        @Override
        public String getValue(@Nonnull String property) {
            if ("property1".equals(property)) {
                return property1;
            }
            return property2;
        }

        @Override
        @Nonnull
        public List<String> getProperties() {
            return List.of("property1", "property2");
        }
    }
}
