package com.zp1ke.flo.data.repository;

import com.zp1ke.flo.data.domain.StorageFile;
import jakarta.annotation.Nonnull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageFileRepository extends JpaRepository<StorageFile, Long> {

    Optional<StorageFile> findByCode(@Nonnull String code);
}
