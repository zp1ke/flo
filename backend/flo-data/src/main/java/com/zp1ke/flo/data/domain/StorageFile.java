package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "storage_files", indexes = {
    @Index(name = "storage_files_unq_code", columnList = "code", unique = true),
    @Index(name = "storage_files_idx_user_id", columnList = "user_id"),
    @Index(name = "storage_files_idx_created_at", columnList = "created_at"),
    @Index(name = "storage_files_idx_updated_at", columnList = "updated_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class StorageFile extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Size(min = 1, max = 255, message = "storage_file.code-size")
    @NotBlank(message = "storage_file.code-required")
    @Column(nullable = false)
    private String code;

    @Size(min = 1, max = 255, message = "storage_file.name-size")
    @NotBlank(message = "storage_file.name-required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "storage_file.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
