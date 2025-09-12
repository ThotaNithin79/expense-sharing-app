package com.roomshare.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final Environment environment;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    /**
     * Sends a simple text-based email using the more robust MimeMessageHelper.
     * @param to The recipient's email address.
     * @param subject The subject line of the email.
     * @param text The body content of the email.
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            String senderEmail = environment.getProperty("spring.mail.username");

            if (senderEmail == null) {
                logger.error("'spring.mail.username' is not configured in application.properties. Cannot send email.");
                throw new RuntimeException("Sender email is not configured.");
            }

            // ** THE FIX IS HERE: We use MimeMessage and MimeMessageHelper for robust email creation **
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            // This properly formats the "From" address as "Expense Sharing App <youremail@gmail.com>"
            // which solves the "Missing '>'" parsing error.
            helper.setFrom(new InternetAddress(senderEmail, "Expense Sharing App"));

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            mailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", to);

        } catch (MessagingException | UnsupportedEncodingException e) {
            // Catch the specific exceptions that can be thrown
            logger.error("Error sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}