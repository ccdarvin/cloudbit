// import and export all 
import { axiosInstance } from "./axios";

export { mapOperator } from "./mapOperator";
export { generateSort } from "./generateSort";
export { generateFilter } from "./generateFilter";
export { axiosInstance } from "./axios";

export const httpClient = axiosInstance;
export const domain = process.env.NODE_ENV === "production" ? "cloudbit.app" : 'example.com';