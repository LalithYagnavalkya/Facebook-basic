export interface RootState {
    auth: {
        isLoggedIn: boolean;
        email: string | null;
        id: string | null;
        accessToken: string | null;
    };
}
export interface Booking {
    _id: string;
    date: string;
    timeSlot: string;
}