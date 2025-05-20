package com.zp1ke.flo.api.security;

import com.zp1ke.flo.api.utils.RequestUtils;
import com.zp1ke.flo.data.domain.Profile;
import com.zp1ke.flo.data.domain.User;
import com.zp1ke.flo.data.service.ProfileService;
import com.zp1ke.flo.data.service.UserService;
import com.zp1ke.flo.utils.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Pattern PROFILE_CODE_PATTERN = Pattern.compile("/api/v.+/profiles/(\\w+)(/.*)?");

    private final JwtTokenProvider jwtTokenProvider;

    private final UserService userService;

    private final ProfileService profileService;

    public static boolean pathRequiresProfile(@NonNull String path) {
        var matcher = PROFILE_CODE_PATTERN.matcher(path);
        return matcher.matches();
    }

    @Nullable
    public static String profileCodeOf(@NonNull String path) {
        var matcher = PROFILE_CODE_PATTERN.matcher(path);
        if (matcher.matches()) {
            return matcher.group(1);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        var token = resolveToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            var username = jwtTokenProvider.parseUsername(token);
            if (username != null) {
                generateAuthentication(username, token, request);
            }
        }
        filterChain.doFilter(request, response);
    }

    private void generateAuthentication(@NonNull String username,
                                        @NonNull String token,
                                        @NonNull HttpServletRequest request) {
        var remoteAddress = RequestUtils.remoteAddress(request);
        var user = userService.findByUsernameAndValidToken(username, token, remoteAddress);
        var path = request.getRequestURI();
        if (user != null && pathRequiresProfile(path) && profileOf(user, path) == null) {
            user = null;
        }

        if (user != null) {
            var authentication = new UsernamePasswordAuthenticationToken(user, token, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    @Nullable
    private String resolveToken(@NonNull HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null) {
            String prefix = "Bearer ";
            if (token.startsWith(prefix)) {
                token = token.substring(prefix.length());
            }
            return token;
        }
        return null;
    }

    @Nullable
    private Profile profileOf(@NonNull User user, @NonNull String path) {
        var profileCode = profileCodeOf(path);
        if (StringUtils.isNotBlank(profileCode)) {
            return profileService.profileOfUserByCode(user, profileCode).orElse(null);
        }
        return null;
    }
}
