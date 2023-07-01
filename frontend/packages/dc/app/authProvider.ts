import type { AuthBindings } from "@refinedev/core";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import qs from "qs";
import { httpClient, domain } from "~/fastAPI/utils";


export const COOKIE_TOKEN = "_t";
export const COOKIE_USER = "_u";
export const API_URL = "http://127.0.0.1:8000";


export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    // Suppose we actually send a request to the back end here.
    const {data} =  await httpClient.post(`${API_URL}/auth/jwt/login`,
      qs.stringify({username: email, password: password}),
      {headers: {'content-type': 'application/x-www-form-urlencoded'}}
    )

    if (data) {
      // save token wiht access by subdomain
      
      Cookies.set(COOKIE_TOKEN, data.access_token, { domain });

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
    // remove token
    Cookies.remove(COOKIE_TOKEN, { domain });

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.statusCode === 401) {
      Cookies.remove(COOKIE_TOKEN, { domain });
      const { pathname } = new URL(window.location.href);
      return {
        redirectTo: `/login?to=${pathname}`,
      };
    }
    return { error };
  },
  check: async (request) => {
    let user = undefined;
    if (request) {
      const hasCookie = request.headers.get("Cookie");
      if (hasCookie) {
        const parsedCookie = cookie.parse(request.headers.get("Cookie"));
        user = parsedCookie[COOKIE_TOKEN];
      }
    } else {
      const parsedCookie = Cookies.get(COOKIE_TOKEN);
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
  getIdentity: async (reload) => {
    const tokenAccess = Cookies.get(COOKIE_TOKEN);
    const user = Cookies.get(COOKIE_USER);
    if (!user) {
      const { data } = await httpClient.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenAccess}`,
        },
      });
      Cookies.set(COOKIE_USER, JSON.stringify(data), { domain });
      return {
        ...data,
        tokenAccess
      }
    }
    return {
      ...JSON.parse(user||'{}'),
      tokenAccess
    }
  },
};
