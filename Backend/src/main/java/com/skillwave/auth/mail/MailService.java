package com.skillwave.auth.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  private final JavaMailSender mailSender;

  public MailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void sendOtp(String to, String otp) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(to);
    msg.setSubject("Skillwave OTP Verification");
    msg.setText("Your Skillwave OTP is: " + otp + "\n\nThis OTP expires in 5 minutes.");
    mailSender.send(msg);
  }
}