package com.skillwave.mentor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Tiny helper to accept either a full YouTube URL or a raw video id.
 * Supports:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - VIDEO_ID
 */
public record YoutubeParse(String videoId, String canonicalUrl) {

  // YouTube ids are typically 11 chars; be permissive but safe.
  private static final Pattern WATCH = Pattern.compile("[?&]v=([A-Za-z0-9_-]{6,})");
  private static final Pattern SHORT = Pattern.compile("youtu\\.be/([A-Za-z0-9_-]{6,})");
  private static final Pattern EMBED = Pattern.compile("youtube\\.com/(?:embed|shorts)/([A-Za-z0-9_-]{6,})");
  private static final Pattern RAW = Pattern.compile("^[A-Za-z0-9_-]{6,}$");

  public static YoutubeParse from(String input) {
    if (input == null) throw new IllegalArgumentException("YouTube URL is required");
    String s = input.trim();
    if (s.isEmpty()) throw new IllegalArgumentException("YouTube URL is required");

    String id = extractId(s);
    if (id == null) {
      throw new IllegalArgumentException("Invalid YouTube link. Paste a YouTube video URL or video id.");
    }
    return new YoutubeParse(id, "https://www.youtube.com/watch?v=" + id);
  }

  private static String extractId(String s) {
    Matcher m;
    m = WATCH.matcher(s);
    if (m.find()) return m.group(1);
    m = SHORT.matcher(s);
    if (m.find()) return m.group(1);
    m = EMBED.matcher(s);
    if (m.find()) return m.group(1);
    if (RAW.matcher(s).matches()) return s;
    return null;
  }
}
