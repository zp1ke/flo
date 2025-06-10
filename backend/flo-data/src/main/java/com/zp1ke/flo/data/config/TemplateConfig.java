package com.zp1ke.flo.data.config;

import freemarker.cache.ClassTemplateLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@Configuration
public class TemplateConfig {

    @Bean
    public FreeMarkerConfigurer freemarkerClassLoaderConfig() {
        var configuration = new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_34);
        var templateLoader = new ClassTemplateLoader(this.getClass(), "/templates");
        configuration.setTemplateLoader(templateLoader);
        configuration.setLocalizedLookup(true);
        var freeMarkerConfigurer = new FreeMarkerConfigurer();
        freeMarkerConfigurer.setConfiguration(configuration);
        return freeMarkerConfigurer;
    }
}
