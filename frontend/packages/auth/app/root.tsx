import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { notificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/remix-router";

import { ColorModeContextProvider, COOKIE_MODE } from "@contexts";
import resetStyle from "@refinedev/antd/dist/reset.css";
import { dataProvider } from "~/fastAPI";
import { authProvider, COOKIE_TOKEN , API_URL } from "~/authProvider";
import { httpClient } from "~/fastAPI/utils";
import * as cookie from "cookie";


export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cloudbit Auth" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet : "utf-8" }
  ]
}

// load theme mode from cookie
export async function loader({ request }: LoaderArgs) {
  const themeMode = cookie.parse(request.headers.get("Cookie") ?? "")[COOKIE_MODE];
  const token = cookie.parse(request.headers.get("Cookie") ?? "")[COOKIE_TOKEN];
  return json({ themeMode, token });
}

export default function App() {
  // confige http client with tocken
  const { token } = useLoaderData();

  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <html lang="es">
      <head>
        <Meta />
        <Links />
        {typeof document === "undefined"
          ? "__STYLES__"
          : null}
      </head>
      <body>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <RefineKbarProvider>
              <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider(API_URL, httpClient)}
                notificationProvider={notificationProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "cloud_app",
                    list: "/apps",
                    create: "/apps/create",
                    edit: "/apps/edit/:id"
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                }}
              >
                <>
                  <Outlet />
                  <UnsavedChangesNotifier />
                  <RefineKbar />
                </>
              </Refine>
            </RefineKbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: resetStyle }];
}
