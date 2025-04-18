import { Request } from 'express';

interface RegisterInput {
    username: string;
    email: string;
    password: string;
    name: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const validateRegisterInput = (input: RegisterInput): string | null => {
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

export const validateLoginInput = (input: LoginInput): string | null => {
    const { email, password } = input;

    if (!email || !password) {
        return 'Email and password are required';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Invalid email format';
    }

    return null;
};
