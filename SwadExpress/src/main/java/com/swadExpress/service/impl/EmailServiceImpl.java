package com.swadExpress.service.impl;

import com.swadExpress.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name:SwadExpress}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendEmail(String to, String subject, String body) {

        try {
            if (brevoApiKey == null || brevoApiKey.isBlank()) {
                logger.error("Brevo API key is missing or empty");
                throw new MailSendException(
                        "Brevo API key is not configured"
                );
            }

            if (senderEmail == null || senderEmail.isBlank()) {
                logger.error("Brevo sender email is missing or empty");
                throw new MailSendException(
                        "Brevo sender email is not configured"
                );
            }

            logger.info(
                    "Brevo API key loaded successfully. Key length: {}",
                    brevoApiKey.length()
            );

            logger.info(
                    "Sending email from {} to {}",
                    senderEmail,
                    to
            );

            HttpHeaders headers = new HttpHeaders();

            headers.set("api-key", brevoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", senderName);
            sender.put("email", senderEmail);

            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", to);

            Map<String, Object> payload = new HashMap<>();

            payload.put("sender", sender);
            payload.put("to", List.of(recipient));
            payload.put("subject", subject);
            payload.put("htmlContent", body);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(payload, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            BREVO_API_URL,
                            request,
                            String.class
                    );

            logger.info(
                    "Email sent successfully to {}. Brevo status: {}",
                    to,
                    response.getStatusCode()
            );

        } catch (HttpClientErrorException e) {

            logger.error(
                    "Brevo API error. Status: {}",
                    e.getStatusCode()
            );

            logger.error(
                    "Brevo response: {}",
                    e.getResponseBodyAsString()
            );

            throw new MailSendException(
                    "Failed to send email through Brevo",
                    e
            );

        } catch (RestClientException e) {

            logger.error(
                    "Failed to send email to {}",
                    to,
                    e
            );

            throw new MailSendException(
                    "Failed to send email through Brevo",
                    e
            );
        }
    }
}