package com.blog.api.service;

import com.blog.api.dto.request.LoginRequest;
import com.blog.api.dto.request.RegisterRequest;
import com.blog.api.dto.response.AuthResponse;
import com.blog.api.entity.User;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.UserMapper;
import com.blog.api.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "jwtExpiration", 86400000L);

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("test@blog.com");
        registerRequest.setNickname("Test User");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("encodedPassword");
        testUser.setEmail("test@blog.com");
        testUser.setNickname("Test User");
        testUser.setStatus(1);
    }

    @Test
    @DisplayName("Register - Success")
    void register_Success() {
        when(userMapper.selectByUsername("testuser")).thenReturn(null);
        when(userMapper.selectByEmail("test@blog.com")).thenReturn(null);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("test-token");
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return 1;
        });

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertNotNull(response.getUser());
        assertEquals("testuser", response.getUser().getUsername());

        verify(userMapper).insert(any(User.class));
    }

    @Test
    @DisplayName("Register - Username Already Exists")
    void register_UsernameAlreadyExists() {
        when(userMapper.selectByUsername("testuser")).thenReturn(testUser);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.register(registerRequest));

        assertEquals(ErrorCode.USERNAME_ALREADY_EXISTS, exception.getErrorCode());
        verify(userMapper, never()).insert(any());
    }

    @Test
    @DisplayName("Register - Email Already Exists")
    void register_EmailAlreadyExists() {
        when(userMapper.selectByUsername("testuser")).thenReturn(null);
        when(userMapper.selectByEmail("test@blog.com")).thenReturn(testUser);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.register(registerRequest));

        assertEquals(ErrorCode.EMAIL_ALREADY_EXISTS, exception.getErrorCode());
        verify(userMapper, never()).insert(any());
    }

    @Test
    @DisplayName("Login - Success")
    void login_Success() {
        when(userMapper.selectByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("test-token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        assertEquals("testuser", response.getUser().getUsername());
    }

    @Test
    @DisplayName("Login - User Not Found")
    void login_UserNotFound() {
        when(userMapper.selectByUsername("testuser")).thenReturn(null);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.login(loginRequest));

        assertEquals(ErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());
    }

    @Test
    @DisplayName("Login - Invalid Password")
    void login_InvalidPassword() {
        when(userMapper.selectByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(false);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.login(loginRequest));

        assertEquals(ErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());
    }

    @Test
    @DisplayName("Logout - Success")
    void logout_Success() {
        when(jwtTokenProvider.getExpirationFromToken("test-token")).thenReturn(86400000L);

        authService.logout("test-token");

        verify(tokenService).addToBlacklist("test-token", 86400000L);
    }

    @Test
    @DisplayName("GetCurrentUser - Success")
    void getCurrentUser_Success() {
        when(userMapper.selectByUsername("testuser")).thenReturn(testUser);

        User user = authService.getCurrentUser("testuser");

        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
    }

    @Test
    @DisplayName("GetCurrentUser - Not Found")
    void getCurrentUser_NotFound() {
        when(userMapper.selectByUsername("testuser")).thenReturn(null);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.getCurrentUser("testuser"));

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }
}
