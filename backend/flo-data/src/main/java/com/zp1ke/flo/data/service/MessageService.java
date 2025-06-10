package com.zp1ke.flo.data.service;

import com.zp1ke.flo.data.error.TemplateException;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.annotation.Nonnull;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageSource messageSource;

    private final FreeMarkerConfigurer freemarkerConfig;

    @Nonnull
    public String message(@Nonnull String code, Object[] args, @Nonnull Locale locale) {
        var message = messageSource.getMessage(code, args, code, locale);
        if (StringUtils.isNotBlank(message)) {
            return message;
        }
        return code;
    }

    @Nonnull
    public String template(@Nonnull String code, Map<String, Object> args, @Nonnull Locale locale) throws TemplateException {
        try {
            var template = freemarkerConfig.getConfiguration().getTemplate(code, locale);
            var data = args != null ? args : Map.of();
            return FreeMarkerTemplateUtils.processTemplateIntoString(template, data);
        } catch (Exception e) {
            throw new TemplateException("Error processing template: " + code, e);
        }
    }
}
