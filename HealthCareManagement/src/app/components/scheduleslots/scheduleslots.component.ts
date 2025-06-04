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

  constructor(private _service: DoctorService, private _router: Router) { }

  ngOnInit(): void {
    // Remove jQuery usage

    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

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
        console.log("process Failed");
        console.log(error.error);
      }
    )
    // Optionally auto-close form:
    // this.showAddSlotForm = false;
  }
}
