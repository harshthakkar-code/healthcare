import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user = new User();
  doctor = new Doctor();
  msg = '';
  activeTab: 'user' | 'doctor' = 'user';  // <--- THIS CONTROLS WHICH TAB IS SHOWN
  showUserPassword: boolean = false;
  showUserConfirmPassword: boolean = false;
  showDoctorPassword: boolean = false;
  showDoctorConfirmPassword: boolean = false;

  constructor(private _registrationService: RegistrationService, private _doctorService: DoctorService, private _router: Router) { }

  ngOnInit(): void {
    // No jQuery required for tabs anymore
  }

  registerUser() {
    if (this.user.password !== this.user.confirmPassword) {
      this.msg = "Passwords do not match!";
      return;
    }
    this._registrationService.registerUserFromRemote(this.user).subscribe(
      data => {
        sessionStorage.setItem("username", this.user.username);
        sessionStorage.setItem("gender", this.user.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        this.msg = "User with " + this.user.email + " already exists!";
      }
    );
  }

  registerDoctor() {
    if (this.doctor.password !== this.doctor.confirmPassword) {
      this.msg = "Passwords do not match!";
      return;
    }
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe(
      data => {
        sessionStorage.setItem("doctorname", this.doctor.doctorname);
        sessionStorage.setItem("gender", this.doctor.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        this.msg = "Doctor with " + this.doctor.email + " already exists!";
      }
    );
  }
}
