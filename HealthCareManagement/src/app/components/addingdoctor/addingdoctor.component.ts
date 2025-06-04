import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // If using Angular Material

@Component({
  selector: 'app-addingdoctor',
  templateUrl: './addingdoctor.component.html',
  styleUrls: ['./addingdoctor.component.css']
})
export class AddingdoctorComponent implements OnInit {
  showDoctorPassword = false;


  doctor = new Doctor();

  constructor(private _service: DoctorService, private _router: Router, private snackBar: MatSnackBar // add this
  ) { }

  ngOnInit(): void {

  }

  addDoctor() {
    this._service.addDoctorFromRemote(this.doctor).subscribe(
    
      data => {
        console.log("Doctor added successfully");
        // const snack = this.snackBar.open('Doctor added successfully!', '', {
        //   duration: 2000,
        //   panelClass: ['success-snackbar']
        // });
        // snack.afterDismissed().subscribe(() => {
        //   this._router.navigate(['/admindashboard']);
        // });
      },
      error => {
        console.log("Error occurred while adding doctor");
        this.snackBar.open('Failed to add doctor.', '', {
          duration: 2500,
          panelClass: ['error-snackbar']
        });
        console.log("process Failed");
        console.log(error.error);
      }
    );
  }



}
