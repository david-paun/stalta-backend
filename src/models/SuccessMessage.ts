export class SuccessMessage {
    constructor(
        public status: number,
        public message: string,
        public data?: any,
        public cookies?: Record<string, string>
    ) {}
}
