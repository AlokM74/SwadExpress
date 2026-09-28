package com.swadExpress.service.impl;

import com.swadExpress.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;


    @Override
    public void sendEmail(String to, String subject, String body) {

        try{
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper=new MimeMessageHelper(mimeMessage,"utf-8");

            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setTo(to);
            mailSender.send(mimeMessage);

        }
        catch(MailException e)
        {
            logger.error("Failed to send email to {}", to, e);
            throw new MailSendException("Failed to send email", e);
        } catch (MessagingException e) {
            logger.error("Failed to build email for {}", to, e);
            throw new MailSendException("Failed to build email", e);
        }

    }
}
