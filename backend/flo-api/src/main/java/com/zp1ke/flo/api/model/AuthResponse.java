package com.zp1ke.flo.api.model;

import com.zp1ke.flo.api.dto.UserDto;

public record AuthResponse(String token, UserDto user) {
}
