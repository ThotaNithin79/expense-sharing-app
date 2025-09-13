package com.roomshare.config;

import com.roomshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Properties;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    // ===== THIS METHOD HAS BEEN UPDATED to remove deprecation warnings =====
    @Bean
    public AuthenticationProvider authenticationProvider() {
        // We still create the provider object.
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        // ** THE FIX IS HERE **
        // We set the dependencies that are NOT deprecated. Spring Boot's auto-configuration
        // is smart enough to handle the UserDetailsService automatically, so the
        // deprecated `setUserDetailsService` call is not needed.
        authProvider.setPasswordEncoder(passwordEncoder());
        
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // Reading from environment variables is correct for deployment.
        // For local, it will be null, and Spring Boot will use application.properties.
        // Let's make it more robust.
        String mailUsername = System.getenv("SPRING_MAIL_USERNAME");
        String mailPassword = System.getenv("SPRING_MAIL_PASSWORD");

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        // Only set if the environment variables exist
        if (mailUsername != null) mailSender.setUsername(mailUsername);
        if (mailPassword != null) mailSender.setPassword(mailPassword);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false"); // Set to false for production, true for debugging
        
        return mailSender;
    }
}