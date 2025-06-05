package com.application.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendAppointmentStatusEmail(String toEmail, String patientName, String appointmentDate, 
                                         String appointmentSlot, String status) throws IOException {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        if (patientName == null || patientName.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient name cannot be null or empty");
        }
        if (appointmentDate == null || appointmentDate.trim().isEmpty()) {
            throw new IllegalArgumentException("Appointment date cannot be null or empty");
        }
        if (appointmentSlot == null || appointmentSlot.trim().isEmpty()) {
            throw new IllegalArgumentException("Appointment slot cannot be null or empty");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }

        logger.info("Attempting to send email to: {}", toEmail);
        logger.debug("Email details - Patient: {}, Date: {}, Slot: {}, Status: {}", 
                    patientName, appointmentDate, appointmentSlot, status);
        
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        String subject = "Appointment " + (status.equals("accepted") ? "Approved" : "Rejected");
        
        String htmlContent = String.format(
            "<h2>Appointment %s</h2>" +
            "<p>Dear %s,</p>" +
            "<p>Your appointment for %s at %s has been %s.</p>" +
            "%s" +
            "<p>Best regards,<br>Hospital Management Team</p>",
            status.equals("accepted") ? "Approved" : "Rejected",
            patientName,
            appointmentDate,
            appointmentSlot,
            status.equals("accepted") ? "approved" : "rejected",
            status.equals("accepted") ? 
                "<p>Please arrive 15 minutes before your scheduled time.</p>" : 
                "<p>Please contact the hospital for alternative appointment slots.</p>"
        );

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            logger.info("Email sent successfully. Status code: {}", response.getStatusCode());
            
            if (response.getStatusCode() >= 400) {
                String errorMessage = String.format("Failed to send email. Status code: %d, Body: %s", 
                    response.getStatusCode(), response.getBody());
                logger.error(errorMessage);
                throw new IOException(errorMessage);
            }
        } catch (IOException e) {
            String errorMessage = String.format("Error sending email: %s", e.getMessage());
            logger.error(errorMessage, e);
            throw new IOException(errorMessage, e);
        }
    }
} 