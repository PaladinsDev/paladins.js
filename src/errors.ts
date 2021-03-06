export class PrivateProfileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PrivateProfileError';
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

// TODO: Add PlayerNotFoundError 

export class UnauthorizedDeveloper extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedDeveloper';
    }
}