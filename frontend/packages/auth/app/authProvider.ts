import type { AuthBindings } from "@refinedev/core";
import { Refine, HttpError } from "@refinedev/core";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import axios from "axios";
import qs from "qs";

// Access-Control-Allow-Origin	Missing Header	
export const httpClient = axios.create();


httpClient.interceptors.response.use(
  (response) => {
      console.log(response);
      return response;
  },
  (error) => {
      const customError: HttpError = {
          ...error,
          message: error.response?.data?.message,
          statusCode: error.response?.status,
      };

      return Promise.reject(customError);
  },
);

const COOKIE_NAME = "_t";
const apiUrl = "http://127.0.0.1:8000";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    // Suppose we actually send a request to the back end here.
    const {data: user} =  await httpClient.post(`${apiUrl}/auth/jwt/login`,
      qs.stringify({username: email, password: password}),
      {headers: {'content-type': 'application/x-www-form-urlencoded'}}
    )

    if (user) {
      Cookies.set(COOKIE_NAME, JSON.stringify(user));
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        message: "Inicio de sesión fallido",
        name: "Correo electrónico o contraseña incorrectos",
      },
    };
  },
  logout: async () => {
    Cookies.remove(COOKIE_NAME);

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async (request) => {
    let user = undefined;
    if (request) {
      const hasCookie = request.headers.get("Cookie");
      if (hasCookie) {
        const parsedCookie = cookie.parse(request.headers.get("Cookie"));
        user = parsedCookie[COOKIE_NAME];
      }
    } else {
      const parsedCookie = Cookies.get(COOKIE_NAME);
      user = parsedCookie ? JSON.parse(parsedCookie) : undefined;
    }

    const { pathname } = new URL(request.url);

    if (!user) {
      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Unauthenticated",
        },
        logout: true,
        redirectTo: `/login?to=${pathname}`,
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const parsedCookie = Cookies.get(COOKIE_NAME);
    if (parsedCookie) {
      const user = parsedCookie ? JSON.parse(parsedCookie) : undefined;
      return user;
    }
    return null;
  },
};
