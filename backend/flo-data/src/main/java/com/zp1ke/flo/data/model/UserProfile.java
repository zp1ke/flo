package com.zp1ke.flo.data.model;

import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public record UserProfile(@NonNull User user, @Nullable Profile profile) {
}
