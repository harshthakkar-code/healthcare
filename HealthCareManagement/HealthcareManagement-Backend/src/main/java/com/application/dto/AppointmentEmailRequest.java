package com.application.dto;

import lombok.Data;

@Data
public class AppointmentEmailRequest {
    private String to;
    private String patientName;
    private String appointmentDate;
    private String appointmentSlot;
    private String status;
} 