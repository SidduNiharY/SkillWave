package com.skillwave.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    long start = System.currentTimeMillis();

    try {
      filterChain.doFilter(request, response);
    } finally {
      long tookMs = System.currentTimeMillis() - start;

      String method = request.getMethod();
      String uri = request.getRequestURI();
      String query = request.getQueryString();
      int status = response.getStatus();

      String fullPath = (query == null) ? uri : (uri + "?" + query);

      log.info("HTTP {} {} -> {} ({} ms)", method, fullPath, status, tookMs);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String uri = request.getRequestURI();
    // keep logs clean
    return uri.startsWith("/actuator") || uri.equals("/favicon.ico");
  }
}