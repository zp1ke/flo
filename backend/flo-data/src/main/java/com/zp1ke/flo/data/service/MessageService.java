package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.error.TemplateException;
import com.zp1ke.flo.utils.StringUtils;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageSource messageSource;

    private final FreeMarkerConfigurer freemarkerConfig;

    @NonNull
    public String message(@NonNull String code, @Nullable Object[] args, @NonNull Locale locale) {
        var message = messageSource.getMessage(code, args, code, locale);
        if (StringUtils.isNotBlank(message)) {
            return message;
        }
        return code;
    }

    @NonNull
    public String template(@NonNull String code, @Nullable Map<String, Object> args, @NonNull Locale locale) throws TemplateException {
        try {
            var template = freemarkerConfig.getConfiguration().getTemplate(code, locale);
            var data = args != null ? args : Map.of();
            return FreeMarkerTemplateUtils.processTemplateIntoString(template, data);
        } catch (Exception e) {
            throw new TemplateException("Error processing template: " + code, e);
        }
    }
}
