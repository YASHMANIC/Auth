
/**
 * This is Public Routes
 * This can be accessed anyone without authorization
 * @typeof{string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verfication"
];

/**
 * This is Api Routes
 *
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];
/**
 * The prefix routes for Api authentication routes starting with these prefixes are used for authneication
 * @type(string)
 */
export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/settings"