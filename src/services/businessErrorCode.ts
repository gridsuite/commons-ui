export class CustomError extends Error {
    status?: number;

    businessErrorCode?: string;

    constructor(message: string, status?: number, businessErrorCode?: string) {
        super(message);
        this.status = status;
        this.businessErrorCode = businessErrorCode;
    }
}
