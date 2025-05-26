package com.zp1ke.flo.api.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserWithProfilesDto {

    private final UserDto user;

    private final List<ProfileDto> profiles;
}
