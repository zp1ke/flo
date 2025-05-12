package com.zp1ke.flo.data.config;

import com.zp1ke.flo.data.model.UserProfile;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.zp1ke.flo.data.domain")
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableJpaRepositories("com.zp1ke.flo.data.repository")
public class JpaConfig {

    @Bean
    public AuditorAware<UserProfile> auditorAware() {
        return new UserAuditorAware();
    }
}
