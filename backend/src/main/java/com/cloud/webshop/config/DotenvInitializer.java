package com.cloud.webshop.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class DotenvInitializer {

    public static void loadDotenv() {
        Properties properties = new Properties();
        try (FileInputStream fis = new FileInputStream(".env")) {
            properties.load(fis);
            properties.forEach((key, value) -> System.setProperty(key.toString(), value.toString()));
        } catch (IOException e) {
            System.err.println("Failed to load .env file: " + e.getMessage());
        }
    }
}