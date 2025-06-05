import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { DoctorService } from 'src/app/services/doctor.service';
import { EmailService } from 'src/app/services/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})
export class PatientlistComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  patients: Appointment[] = [];
  slots$: Observable<any[]> = of([]);

  constructor(
    private _service: DoctorService,
    private emailService: EmailService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');

    let obs: Observable<Appointment[]>;
    if (this.currRole.toLowerCase() === "user") {
      obs = this._service.getPatientListByDoctorEmail(this.loggedUser);
    } else {
      obs = this._service.getPatientList();
    }
    obs.subscribe(patients => {
      this.patients = patients;
    });

    this.slots$ = this._service.getSlotDetails(this.loggedUser);
  }

  acceptRequest(slot: string, patient: Appointment) {
    this._service.acceptRequestForPatientApproval(slot).subscribe(() => {
      patient.appointmentstatus = 'accept';
      this.snackBar.open('Appointment accepted!', 'Close', { duration: 2000 });
      this.sendMail(patient, 'accepted');
    });
  }

  rejectRequest(slot: string, patient: Appointment) {
    this._service.rejectRequestForPatientApproval(slot).subscribe(() => {
      patient.appointmentstatus = 'reject';
      this.snackBar.open('Appointment rejected!', 'Close', { duration: 2000 });
      this.sendMail(patient, 'rejected');
    });
  }

  private sendMail(patient: any, status: 'accepted' | 'rejected') {
    this.emailService.sendAppointmentStatusEmail(
      patient.email,
      patient.patientname,
      patient.date,
      patient.slot,
      status
    ).subscribe({
      next: () => {
        this.snackBar.open(`Email ${status} sent successfully`, 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error sending email:', error);
      }
    });
  }
}
