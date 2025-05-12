package com.zp1ke.flo.data.domain;

import com.zp1ke.flo.data.domain.core.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.lang.NonNull;

@Entity
@Table(name = "profiles", indexes = {
    @Index(name = "profiles_unq_code", columnList = "code", unique = true),
    @Index(name = "profiles_idx_user_id", columnList = "user_id"),
    @Index(name = "profiles_idx_created_at", columnList = "created_at"),
    @Index(name = "profiles_idx_updated_at", columnList = "updated_at"),
})
@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Profile extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.MODULE)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @Size(min = 3, message = "profile.name-size")
    @NotBlank(message = "profile.name-required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "profile.user-required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NonNull
    public static Profile fromUser(@NonNull User user) {
        return Profile.builder()
            .user(user)
            .name(user.getUsername())
            .build();
    }
}
