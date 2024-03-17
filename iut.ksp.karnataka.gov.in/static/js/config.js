/**
 * DEV DEPENDENCIES
 */

export const API_BASE_URL = "https://iut.ksp.karnataka.gov.in/api/";
// export const API_BASE_URL = "http://localhost:4041/";
export const BASE_URL = "/";
export const SOCKET_URL = "http://localhost:4040";
export const BASE_LINK = "/";
export const SOCKET_PATH = "/";
// export const ROOT_DIRECTORY = '/employees-corner/inter-unit-transfers';
export const ROOT_DIRECTORY = '/';


/**
 * COMMON FOR BOTH DEV & PROD
 */
export const AUTHOR_NAME = "CeG, Govt. of Karnataka";
export const BRAND_NAME = "KSP";
export const JWT_SECRET = "cegPolTransGovtSecrtKa";
export const FIRST_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const LOGGER = process.env.NODE_ENV === 'development';
// export const ROOT_DIRECTORY = '/employees-corner/inter-unit-transfers';
export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE'
}