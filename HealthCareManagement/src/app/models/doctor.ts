export class Doctor {
    doctorname: string = '';
    email: string = '';
    gender: string = '';
    mobile: string = '';
    experience: string = '';
    address: string = '';
    specialization: string = '';
    previoushospital: string = '';
    password: string = '';
    status: string = 'false';
    photo?: string; // ✅ new field for base64 photo
    // --- Add these for form logic ---
    confirmPassword?: string = ''; // For confirm password field
    agree?: boolean = false;       // For "I agree to Terms" checkbox

    constructor() {}
}
