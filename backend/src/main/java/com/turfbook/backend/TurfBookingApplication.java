package com.turfbook.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TurfBookingApplication {	

	public static void main(String[] args) {
		SpringApplication.run(TurfBookingApplication.class, args);
	}

}
