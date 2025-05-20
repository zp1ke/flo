package com.zp1ke.flo.api.utils;

import com.opencsv.bean.function.AccessorInvoker;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class RequestUtils {

    /**
     * Retrieves the remote IP address from the given {@link HttpServletRequest}.
     * <p>
     * Checks common proxy headers (\`X-Forwarded-For\`, \`X-Real-IP\`) for a valid IP address.
     * If none are found or the value is blank/unknown, falls back to \`getRemoteAddr()\`.
     * Returns "unknown" if no valid address is found or on error.
     *
     * @param httpRequest the HTTP request, may be null
     * @return the remote IP address as a string, or "unknown" if not available
     */
    @NonNull
    public static String remoteAddress(@Nullable HttpServletRequest httpRequest) {
        var unknown = "unknown";
        AccessorInvoker<String, Boolean> isValid = (value) -> StringUtils.isNotBlank(value) && !unknown.equalsIgnoreCase(value.trim());
        try {
            if (httpRequest != null) {
                var headerKeys = List.of("X-Forwarded-For", "X-Real-IP");
                var ipAddress = "";
                for (var headerKey : headerKeys) {
                    ipAddress = httpRequest.getHeader(headerKey);
                    if (isValid.invoke(ipAddress)) {
                        break;
                    }
                    ipAddress = httpRequest.getHeader(headerKey.toUpperCase());
                    if (isValid.invoke(ipAddress)) {
                        break;
                    }
                }

                if (!isValid.invoke(ipAddress)) {
                    ipAddress = httpRequest.getRemoteAddr();
                }

                if (isValid.invoke(ipAddress)) {
                    return ipAddress.trim();
                }
            }
        } catch (Exception ignored) {
        }
        return unknown;
    }
}
