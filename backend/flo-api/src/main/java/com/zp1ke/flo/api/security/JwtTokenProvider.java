package com.zp1ke.flo.api.security;

import com.zp1ke.flo.utils.StringUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

/**
 * Component responsible for JWT (JSON Web Token) operations in the application.
 * <p>
 * This component provides functionality to generate, validate, and parse JWT tokens
 * used for authentication and authorization. It leverages the JJWT library to handle
 * token creation and verification, using a secret key defined in the application
 * properties.
 * </p>
 * <p>
 * The tokens created by this provider include the user's unique code as the subject,
 * a standard issuer, issuance timestamps, and an expiration time configured via
 * application properties.
 * </p>
 * <p>
 * This component is primarily used by the authentication mechanisms in the application
 * to secure endpoints and validate user credentials without requiring session state.
 * </p>
 */
@Component
public class JwtTokenProvider {

    private static final String ISSUER = "com.zp1ke.flo";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expirationInHours}")
    private int expirationTimeInHours;

    /**
     * Generates a new JWT token for the specified user.
     * <p>
     * This method creates a new signed JWT token containing the user's code as the subject.
     * The token includes standard claims such as issuer, issuance time, and expiration time
     * (calculated based on the configured expiration period).
     * </p>
     *
     * @param username the unique code of the user for whom to generate the token, must not be null
     * @return a signed JWT token string that can be used for authentication
     * @throws NullPointerException if the provided username is null
     */
    @NonNull
    public String generateToken(@NonNull String username) {
        var timeMillis = System.currentTimeMillis();
        var expirationTimeMillis = expirationTimeInHours * 60 * 60 * 1000L;
        return Jwts.builder()
            .subject(username)
            .issuer(ISSUER)
            .issuedAt(new Date(timeMillis))
            .expiration(new Date(timeMillis + expirationTimeMillis))
            .signWith(jwtKey())
            .compact();
    }

    /**
     * Validates whether a JWT token is valid and not expired.
     * <p>
     * This method attempts to parse the token and verify its signature and issuer.
     * A token is considered valid if it can be successfully parsed and contains
     * a non-blank user code.
     * </p>
     *
     * @param token the JWT token string to validate, may be null
     * @return true if the token is valid and not expired, false otherwise
     */
    public boolean validateToken(@Nullable String token) {
        var userCode = parseUsername(token);
        return StringUtils.isNotBlank(userCode);
    }

    /**
     * Extracts the user code (subject) from a JWT token.
     * <p>
     * This method attempts to parse the provided token, verify its signature,
     * and extract the subject claim which represents the user's unique code.
     * If the token cannot be parsed or verified, null is returned.
     * </p>
     *
     * @param token the JWT token from which to extract the user code, may be null
     * @return the user code extracted from the token, or null if the token is invalid or null
     */
    @Nullable
    public String parseUsername(@Nullable String token) {
        try {
            var payload = Jwts.parser()
                .verifyWith(jwtKey())
                .requireIssuer(ISSUER)
                .build()
                .parse(token)
                .getPayload();
            if (payload instanceof Claims claims) {
                return claims.getSubject();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * Creates a SecretKey instance from the configured secret string.
     * <p>
     * This private method converts the secret key string from application properties
     * into a cryptographic key suitable for signing and verifying JWT tokens.
     * </p>
     *
     * @return a SecretKey instance for JWT operations
     */
    @NonNull
    private SecretKey jwtKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
}