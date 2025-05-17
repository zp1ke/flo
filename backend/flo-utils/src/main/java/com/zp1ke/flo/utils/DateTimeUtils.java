package com.zp1ke.flo.utils;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

public class DateTimeUtils {
    public static OffsetDateTime toOffsetDateTime(LocalDate date) {
        if (date != null) {
            var datetime = date.atStartOfDay();
            var zoneOffSet = ZoneId.systemDefault().getRules().getOffset(datetime);
            return datetime.atOffset(zoneOffSet);
        }
        return null;
    }
}
