export interface Paging {
    limit: number;
    offset: number;
}

export interface DynamicFilter {
    [field: string]: string;
}
