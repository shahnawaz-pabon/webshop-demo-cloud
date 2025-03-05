package com.cloud.webshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") private String sender;
    @Value("${spring.mail.host}") private String host;
    @Value("${spring.mail.port}") private String port;

    public void sendEmail(String to, String subject, String text) {
        try {
            System.out.println("Sending email to " + host);
            System.out.println("Sending email to " + port);
            System.out.println("Sending email to " + sender);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send email: {}", e.getMessage(), e);
        }
    }
}