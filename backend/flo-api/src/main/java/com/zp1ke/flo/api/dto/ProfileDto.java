package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Profile;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import org.springframework.lang.NonNull;

@Getter
@Builder
public class ProfileDto {

    private String code;

    @Size(min = 3, message = "profile.name-size")
    private String name;

    @NonNull
    public static ProfileDto fromProfile(@NonNull Profile profile) {
        return ProfileDto.builder()
            .code(profile.getCode())
            .name(profile.getName())
            .build();
    }

    @NonNull
    public Profile toProfile() {
        return Profile.builder()
            .code(code)
            .name(name)
            .build();
    }
}
