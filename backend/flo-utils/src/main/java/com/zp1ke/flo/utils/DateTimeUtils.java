package com.zp1ke.flo.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateTimeUtils {

    /**
     * Converts a LocalDate to an OffsetDateTime using the system default time zone.
     *
     * @param date the LocalDate to convert
     * @return the corresponding OffsetDateTime, or null if the input date is null
     */
    public static OffsetDateTime toOffsetDateTime(LocalDate date) {
        if (date != null) {
            return toOffsetDateTime(date.atStartOfDay());
        }
        return null;
    }

    /**
     * Converts a Date to an OffsetDateTime using the system default time zone.
     *
     * @param date the Date to convert
     * @return the corresponding OffsetDateTime, or null if the input date is null
     */
    public static OffsetDateTime toOffsetDateTime(Date date) {
        if (date != null) {
            var localDateTime = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
            return toOffsetDateTime(localDateTime);
        }
        return null;
    }

    /**
     * Converts a LocalDateTime to an OffsetDateTime using the system default time zone.
     *
     * @param datetime the LocalDateTime to convert
     * @return the corresponding OffsetDateTime, or null if the input datetime is null
     */
    public static OffsetDateTime toOffsetDateTime(LocalDateTime datetime) {
        if (datetime != null) {
            var zoneOffSet = ZoneId.systemDefault().getRules().getOffset(datetime);
            return datetime.atOffset(zoneOffSet);
        }
        return null;
    }
}
