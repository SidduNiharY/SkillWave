package com.skillwave.auth;

import com.skillwave.user.User;
import com.skillwave.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final UserService userService;
  private final JwtService jwtService;

  @Value("${app.frontend.successRedirect:http://localhost:5173/auth/callback}")
  private String successRedirect;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");
    String picture = oAuth2User.getAttribute("picture");

    User user = userService.upsertOAuthUser(email, name, picture);
    String token = jwtService.createAccessToken(user);

    String redirectUrl = UriComponentsBuilder.fromUriString(successRedirect)
      .queryParam("token", token)
      .build()
      .toUriString();

    response.sendRedirect(redirectUrl);
  }
}