package com.zp1ke.flo.api.dto;

import com.zp1ke.flo.data.domain.Profile;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileDto {

    private String code;

    @Size(min = 3, message = "profile.name-size")
    private String name;

    @Nonnull
    public static ProfileDto fromProfile(@Nonnull Profile profile) {
        return ProfileDto.builder()
            .code(profile.getCode())
            .name(profile.getName())
            .build();
    }

    @Nonnull
    public Profile toProfile() {
        return Profile.builder()
            .code(code)
            .name(name)
            .build();
    }
}
