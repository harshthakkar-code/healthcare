import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiURL + '/api/email';

  constructor(private http: HttpClient) { }

  sendAppointmentStatusEmail(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentSlot: string,
    status: 'accepted' | 'rejected'
  ): Observable<any> {
    const emailData = {
      to: patientEmail,
      subject: `Appointment ${status === 'accepted' ? 'Approved' : 'Rejected'}`,
      patientName,
      appointmentDate,
      appointmentSlot,
      status
    };

    return this.http.post(`${this.apiUrl}/send-appointment-status`, emailData);
  }
} 