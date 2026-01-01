package com.skillwave.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

  public static final String TOPIC_DOMAIN_EVENTS = "skillwave.domain-events";

  @Bean
  public NewTopic domainEventsTopic() {
    return new NewTopic(TOPIC_DOMAIN_EVENTS, 1, (short) 1);
  }
}