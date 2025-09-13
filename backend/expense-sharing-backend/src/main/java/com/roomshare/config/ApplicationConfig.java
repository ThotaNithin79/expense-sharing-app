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

    // ===== THIS IS THE FINAL, ROBUST, AND DEPLOYMENT-READY CONFIGURATION =====
    @Bean
    public AuthenticationProvider authenticationProvider() {
        // 1. Create the provider object.
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        // 2. EXPLICITLY set the UserDetailsService.
        // This is the most critical step and removes all ambiguity for Spring's dependency injection.
        authProvider.setUserDetailsService(userDetailsService());
        
        // 3. EXPLICITLY set the PasswordEncoder.
        authProvider.setPasswordEncoder(passwordEncoder());
        
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        String mailUsername = System.getenv("SPRING_MAIL_USERNAME");
        String mailPassword = System.getenv("SPRING_MAIL_PASSWORD");

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        // This part is correct for using Render's environment variables
        if (mailUsername != null && !mailUsername.isEmpty()) mailSender.setUsername(mailUsername);
        if (mailPassword != null && !mailPassword.isEmpty()) mailSender.setPassword(mailPassword);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false"); // Keep false for production
        
        return mailSender;
    }
}