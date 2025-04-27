"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInput = exports.validateRegisterInput = void 0;
const validateRegisterInput = (input) => {
    const { username, email, password, name } = input;
    if (!username || !email || !password || !name) {
        return 'All fields are required';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Invalid email format';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    return null;
};
exports.validateRegisterInput = validateRegisterInput;
const validateLoginInput = (input) => {
    const { username, password } = input;
    if (!username || !password) {
        return 'Username and password are required';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};
exports.validateLoginInput = validateLoginInput;
