package com.skillwave.mentor;

import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public record YoutubeParse(String videoId, String canonicalUrl) {

  // YouTube video id is usually 11 chars: letters, numbers, - _
  private static final Pattern ID_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]{11}$");

  private static final Pattern WATCH_V_PATTERN =
      Pattern.compile("[?&]v=([a-zA-Z0-9_-]{11})");

  private static final Pattern SHORTS_PATTERN =
      Pattern.compile("/shorts/([a-zA-Z0-9_-]{11})");

  private static final Pattern EMBED_PATTERN =
      Pattern.compile("/embed/([a-zA-Z0-9_-]{11})");

  private static final Pattern YOUTU_BE_PATTERN =
      Pattern.compile("youtu\\.be/([a-zA-Z0-9_-]{11})");

  public static YoutubeParse from(String input) {
    if (input == null) {
      throw new IllegalArgumentException("Invalid YouTube link. Paste a YouTube video URL or video id.");
    }

    String s = input.trim();
    if (s.isBlank()) {
      throw new IllegalArgumentException("Invalid YouTube link. Paste a YouTube video URL or video id.");
    }

    // 1) raw id support
    if (ID_PATTERN.matcher(s).matches()) {
      return new YoutubeParse(s, canonical(s));
    }

    // 2) try common regex extracts (works even if URL parse fails)
    String id =
        firstMatch(WATCH_V_PATTERN, s,
        firstMatch(SHORTS_PATTERN, s,
        firstMatch(EMBED_PATTERN, s,
        firstMatch(YOUTU_BE_PATTERN, s, null))));

    if (id != null) {
      return new YoutubeParse(id, canonical(id));
    }

    // 3) final fallback: parse as URI and read query param v=...
    try {
      URI uri = URI.create(s);
      String query = uri.getQuery(); // v=VIDEO_ID&...
      if (query != null) {
        Matcher m = WATCH_V_PATTERN.matcher("?" + query);
        if (m.find()) {
          id = m.group(1);
          return new YoutubeParse(id, canonical(id));
        }
      }
    } catch (Exception ignored) {
      // ignore and throw below
    }

    throw new IllegalArgumentException("Invalid YouTube link. Paste a YouTube video URL or video id.");
  }

  private static String canonical(String videoId) {
    return "https://www.youtube.com/watch?v=" + videoId;
  }

  private static String firstMatch(Pattern p, String s, String fallback) {
    Matcher m = p.matcher(s);
    return m.find() ? m.group(1) : fallback;
  }
}