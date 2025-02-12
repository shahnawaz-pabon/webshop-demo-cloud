package com.cloud.webshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.cloud.webshop.config.DotenvInitializer;

@SpringBootApplication
public class WebshopApplication {

	public static void main(String[] args) {
		// load .env file
		DotenvInitializer.loadDotenv();
		SpringApplication.run(WebshopApplication.class, args);
	}

}
