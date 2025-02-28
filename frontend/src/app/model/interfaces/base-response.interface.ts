export interface BaseResponse<T> {
    status: string;
    message: string;
    data: T;
    page: number;
    size: number;
    totalPages: number;
    totalItems: number;
} 