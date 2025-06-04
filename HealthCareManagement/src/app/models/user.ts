export class User {
    username: string = '';
    email: string = '';
    gender: string = '';
    mobile: string = '';
    age: string = '';
    address: string = '';
    password: string = '';
    // --- Add these for form logic ---
    confirmPassword?: string = ''; // For confirm password field
    agree?: boolean = false;       // For "I agree to Terms" checkbox

    constructor() {}
}
