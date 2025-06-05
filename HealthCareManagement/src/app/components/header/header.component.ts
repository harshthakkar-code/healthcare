import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedUser = '';
  currRole = '';
  title = '';
  sidebarOpen = false; // for hamburger menu

  constructor(private _router: Router) {}

  ngOnInit(): void {
    // Read from sessionStorage
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    // Set dashboard title
    this.title = this.getDashboardTitle();
  }

  getDashboardTitle(): string {
    if (this.loggedUser === 'admin@gmail.com' || this.currRole === 'admin') {
      return 'Admin Dashboard';
    }
    if (this.currRole === 'doctor') {
      return 'Doctor Dashboard';
    }
    return 'Patient Dashboard';
  }

  // Hamburger menu
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Home navigation (by role)
  navigateHome() {
    if (this.loggedUser === 'admin@gmail.com' || this.currRole === 'admin') {
      this._router.navigate(['/admindashboard']);
    } else if (this.currRole === 'doctor') {
      this._router.navigate(['/doctordashboard']);
    } else if (this.currRole === 'user') {
      this._router.navigate(['/userdashboard']);
    }
  }

  // Doctors List navigation (set route as per your project)
  navigateDoctorsList() {
    this._router.navigate(['/doctorlist']); // change route if needed
  }

  // Edit Profile navigation (set route as per your app)
  editProfile() {
    if (this.currRole === 'admin') {
      this._router.navigate(['/admin/edit-profile']); // Example route
    } else if (this.currRole === 'doctor') {
      this._router.navigate(['/doctor/edit-profile']);
    } else if (this.currRole === 'user') {
      this._router.navigate(['/edituserprofile']);
    }
  }

  //New Appointments
  bookAppointment() {
    this._router.navigate(['/bookappointment']);
  }


  //check Slots
  checkSlots() {
    this._router.navigate(['/checkslots']);
  }

  // Approval Status
  approvalStatus() {
    this._router.navigate(['/approvalstatus']);
  }

  //your Schedule
  yourSchedule() {
    this._router.navigate(['/scheduleslots']);
  }

  //Patient List
  patientList() {
    this._router.navigate(['/patientlist']);
  }

  //appointments
  appointments() {
    this._router.navigate(['/appointments']);
  }

  //addPrescription
  addPrescription() {
    this._router.navigate(['/addprescription']);
  }

  //userList
  userlist() {
    this._router.navigate(['/userlist']);
  }

  //approvedoctors
  approvedoctors() {
    this._router.navigate(['/approvedoctors']);
  }

 //addDoctor
 addDoctor() {
  this._router.navigate(['/add-doctor']);
}

  //yourPrescription
  yourPrescription() {
    this._router.navigate(['/prescriptionlist']);
  }

  // Log out
  logout() {
    sessionStorage.clear();
    this._router.navigate(['/login']);
  }
}
