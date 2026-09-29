package com.swadExpress.service.impl;

import com.swadExpress.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name:SwadExpress}")
    private String senderName;

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    @Override
    public void sendEmail(String to, String subject, String body) {

        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.error("Brevo API key is missing");
            throw new MailSendException("Brevo API key is not configured");
        }

        if (senderEmail == null || senderEmail.isBlank()) {
            log.error("Brevo sender email is missing");
            throw new MailSendException("Brevo sender email is not configured");
        }

        if (to == null || to.isBlank()) {
            log.error("Recipient email is missing");
            throw new MailSendException("Recipient email is required");
        }

        log.info(
                "Brevo API key loaded successfully. Key length: {}",
                brevoApiKey.length()
        );

        log.info(
                "Sending email from {} to {}",
                senderEmail,
                to
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("api-key", brevoApiKey);

        Map<String, Object> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);

        Map<String, Object> recipient = new HashMap<>();
        recipient.put("email", to);

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("sender", sender);
        requestBody.put("to", List.of(recipient));
        requestBody.put("subject", subject);
        requestBody.put("htmlContent", body);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        try {

            var response = restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

            log.info(
                    "Brevo email request successful. Status: {}",
                    response.getStatusCode()
            );

            if (response.getBody() != null) {
                log.info(
                        "Brevo response: {}",
                        response.getBody()
                );
            }

        } catch (HttpClientErrorException e) {

            log.error(
                    "Brevo API error. Status: {}",
                    e.getStatusCode()
            );

            log.error(
                    "Brevo response body: [{}]",
                    e.getResponseBodyAsString()
            );

            log.error(
                    "Brevo response headers: {}",
                    e.getResponseHeaders()
            );

            throw new MailSendException(
                    "Brevo rejected the email request: "
                            + e.getStatusCode()
            );

        } catch (RestClientException e) {

            log.error(
                    "Brevo REST client error: {}",
                    e.getMessage(),
                    e
            );

            throw new MailSendException(
                    "Failed to communicate with Brevo"
            );

        } catch (Exception e) {

            log.error(
                    "Unexpected error while sending email: {}",
                    e.getMessage(),
                    e
            );

            throw new MailSendException(
                    "Unexpected error while sending email"
            );
        }
    }
}