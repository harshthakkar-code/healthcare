package com.application.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.model.User;
import com.application.service.DoctorRegistrationService;
import com.application.service.UserRegistrationService;
import com.application.service.S3Service;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class RegistrationController 
{
	@Autowired
	private S3Service s3Service;

	@Autowired
	private UserRegistrationService userRegisterService;
	
	@Autowired
	private DoctorRegistrationService doctorRegisterService;
	
@PostMapping(value = "/registeruser", consumes = "multipart/form-data")
@CrossOrigin(origins = "http://localhost:4200")
public ResponseEntity<?> registerUser(
    @RequestPart("user") User user,
    @RequestPart(value = "file", required = false) MultipartFile file
) throws Exception {
    String currEmail = user.getEmail();
    if (currEmail != null && !"".equals(currEmail)) {
        User existing = userRegisterService.fetchUserByEmail(currEmail);
        if (existing != null) {
            throw new Exception("User with " + currEmail + " already exists!");
        }
    }

    if (file != null && !file.isEmpty()) {
		String fileUrl = s3Service.uploadFile(file, "users");   // for registerUser
        user.setPhoto(fileUrl);                       // Save S3 path in DB
    }

    User saved = userRegisterService.saveUser(user);
    return ResponseEntity.ok(saved);
}

	
@PostMapping(value = "/registerdoctor", consumes = "multipart/form-data")
@CrossOrigin(origins = "http://localhost:4200")
public ResponseEntity<?> registerDoctor(
    @RequestPart("doctor") Doctor doctor,
    @RequestPart(value = "file", required = false) MultipartFile file
) throws Exception {
    String currEmail = doctor.getEmail();
    if (currEmail != null && !"".equals(currEmail)) {
        Doctor existing = doctorRegisterService.fetchDoctorByEmail(currEmail);
        if (existing != null) {
            throw new Exception("Doctor with " + currEmail + " already exists!");
        }
    }

    if (file != null && !file.isEmpty()) {
		String fileUrl = s3Service.uploadFile(file, "doctor");
        doctor.setPhoto(fileUrl);                     // Save S3 path in DB
    }

    Doctor saved = doctorRegisterService.saveDoctor(doctor);
    return ResponseEntity.ok(saved);
}

	
	@PostMapping("/addDoctor")
	@CrossOrigin(origins = "http://localhost:4200")
	public Doctor addNewDoctor(@RequestBody Doctor doctor) throws Exception
	{
		Doctor doctorObj = null;
		doctorObj = doctorRegisterService.saveDoctor(doctor);
		return doctorObj;
	}
	
	@GetMapping("/gettotalusers")
	@CrossOrigin(origins = "http://localhost:4200")
	public ResponseEntity<List<Integer>> getTotalSlots() throws Exception
	{
		List<User> users = userRegisterService.getAllUsers();
		List<Integer> al = new ArrayList<>();
		al.add(users.size());
		return new ResponseEntity<List<Integer>>(al, HttpStatus.OK);
	}

}
