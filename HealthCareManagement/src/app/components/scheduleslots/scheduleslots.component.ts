import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Slots } from 'src/app/models/slots';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-scheduleslots',
  templateUrl: './scheduleslots.component.html',
  styleUrls: ['./scheduleslots.component.css']
})
export class ScheduleslotsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  slot = new Slots();
  slots: Observable<Slots[]> | undefined;

  // Control Add Slot Form visibility
  showAddSlotForm = false;
  doctorName: string = '';
  doctorEmail: string = '';
  doctorSpecialization: string = '';

  constructor(private _service: DoctorService, private _router: Router) { }

 ngOnInit(): void {
  this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
  this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');

  // Set local vars for easy template use
  this.doctorName = (sessionStorage.getItem('name') || '').replace(/"/g, '');
  this.doctorEmail = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
  this.doctorSpecialization = (sessionStorage.getItem('specialization') || '').replace(/"/g, '');

  // Pre-fill slot fields for form
  this.slot.doctorname = this.doctorName;
  this.slot.email = this.doctorEmail;
  this.slot.specialization = this.doctorSpecialization;

  this.slots = this._service.getSlotDetails(this.loggedUser);
}


  openAddSlotForm() {
    this.showAddSlotForm = true;
  }

  closeAddSlotForm() {
    this.showAddSlotForm = false;
  }

  addSlot() {
    this._service.addBookingSlots(this.slot).subscribe(
      data => {
        console.log("Slots added Successfully");
        this._router.navigate(['/doctordashboard']);
      },
      error => {
        this.slot = new Slots(); // Reset form
        this.closeAddSlotForm();
        console.log("process Failed");
        console.log(error.error);
      }
    )
    // Optionally auto-close form:
    // this.showAddSlotForm = false;
  }
}
