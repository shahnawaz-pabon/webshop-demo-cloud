import { Address } from './address.interface';

export interface UserData {
    email: string;
    confirmEmail: string;
    password: string;
    fullName: string;
    address: Address;
} 