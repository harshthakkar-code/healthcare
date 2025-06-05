export class User {
    username: string = '';
    email: string = '';
    gender: string = '';
    mobile: string = '';
    age: string = '';
    address: string = '';
    password: string = '';
    photo?: string; // ✅ new field for base64 photo
    // --- Add these for form logic ---
    confirmPassword?: string = ''; // For confirm password field
    agree?: boolean = false;       // For "I agree to Terms" checkbox

    constructor() {}
}
