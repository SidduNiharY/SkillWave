package com.skillwave.outbox;

public final class OutboxTypes {
  private OutboxTypes() {}

  public static final String AGG_PAYMENT = "PAYMENT";
  public static final String EVT_PAYMENT_SUCCEEDED = "PaymentSucceeded";
}