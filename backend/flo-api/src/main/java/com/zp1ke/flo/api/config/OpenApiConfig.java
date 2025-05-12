package com.zp1ke.flo.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI(BuildProperties buildProperties) {
        return new OpenAPI()
            .components(new Components()
                .addSecuritySchemes(
                    "Bearer JWT",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("Bearer").bearerFormat("JWT")
                        .in(SecurityScheme.In.HEADER).name("Authorization")))
            .info(new Info()
                .title("Flo API")
                .version(buildProperties.getVersion())
                .description("API documentation for Flo project"))
            .addSecurityItem(
                new SecurityRequirement()
                    .addList("Bearer JWT"));
    }
}
