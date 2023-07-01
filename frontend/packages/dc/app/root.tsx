import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from "@remix-run/react";

import { notificationProvider } from "@refinedev/antd";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/remix-router";

import { ColorModeContextProvider, COOKIE_MODE } from "@contexts";
import resetStyle from "@refinedev/antd/dist/reset.css";
import dataProvider from "@refinedev/simple-rest";
import { authProvider, COOKIE_TOKEN , API_URL } from "~/authProvider";
import { httpClient } from "@fastAPI/utils";
import * as cookie from "cookie";


export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cloudbit Auth" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet : "utf-8" }
  ]
}


export async function loader({ request }: LoaderArgs) {
  const themeMode = cookie.parse(request.headers.get("Cookie") ?? "")[COOKIE_MODE];
  const token = cookie.parse(request.headers.get("Cookie") ?? "")[COOKIE_TOKEN];
  return json({ themeMode, token });
}


export default function App() {

  const { app } = useParams();

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
                    name: "blog_posts",
                    list: `${app}/blog-posts`,
                    create: `${app}/blog-posts/create`,
                    edit: `${app}/blog-posts/edit/:id`,
                    show: `${app}/blog-posts/show/:id`,
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "categories",
                    list: "/categories",
                    create: "/categories/create",
                    edit: "/categories/edit/:id",
                    show: "/categories/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
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
