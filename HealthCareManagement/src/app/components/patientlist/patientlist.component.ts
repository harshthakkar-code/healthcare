import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { Doctor } from 'src/app/models/doctor';
import { Slots } from 'src/app/models/slots';
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
  patients : Observable<Appointment[]> | undefined;
  slots : Observable<Slots[]> | undefined;
  responses : Observable<any> | undefined;

  constructor(
    private _service : DoctorService,
    private emailService: EmailService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    if(this.currRole === "user")
    {
      this.patients = this._service.getPatientListByDoctorEmail(this.loggedUser);
    }
    else
    {
      this.patients = this._service.getPatientList();
    }
    this.slots = this._service.getSlotDetails(this.loggedUser);
  }

  acceptRequest(slot : string, patient: any)
  {
    this.responses = this._service.acceptRequestForPatientApproval(slot);
    $("#acceptbtn").hide();
    $("#rejectbtn").hide();
    $("#acceptedbtn").show();
    $("#rejectedbtn").hide();

    console.log("Accepting appointment for slot:", patient);

    // Send acceptance email
    this.emailService.sendAppointmentStatusEmail(
      patient.email,
      patient.patientname,
      patient.date,
      patient.slot,
      'accepted'
    ).subscribe({
      next: () => {
        this.snackBar.open('Appointment accepted and email sent successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error sending email:', error);
        // this.snackBar.open('Error sending email notification', 'Close', {
        //   duration: 3000
        // });
      }
    });
  }

  rejectRequest(slot : string, patient: any)
  {
    this.responses = this._service.rejectRequestForPatientApproval(slot);
    $("#acceptbtn").hide();
    $("#rejectbtn").hide();
    $("#acceptedbtn").hide();
    $("#rejectedbtn").show();

    // Send rejection email
    this.emailService.sendAppointmentStatusEmail(
      patient.email,
      patient.patientname,
      patient.date,
      patient.slot,
      'rejected'
    ).subscribe({
      next: () => {
        this.snackBar.open('Appointment rejected and email sent successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error sending email:', error);
        // this.snackBar.open('Error sending email notification', 'Close', {
        //   duration: 3000
        // });
      }
    });
  }
}
