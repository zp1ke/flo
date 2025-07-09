package com.zp1ke.flo.data.domain.core;

import com.zp1ke.flo.tools.model.Mappable;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Auditable implements Mappable {
    @Column(name = "created_at", nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void preUpdate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        updatedAt = OffsetDateTime.now();
    }

    @Nonnull
    @Override
    public List<String> getProperties() {
        return List.of("createdAt", "updatedAt");
    }

    @Override
    public String getValue(@Nonnull String property) {
        if ("createdAt".equals(property)) {
            return createdAt != null ? createdAt.toString() : null;
        } else if ("updatedAt".equals(property)) {
            return updatedAt != null ? updatedAt.toString() : null;
        }
        return null;
    }
}
