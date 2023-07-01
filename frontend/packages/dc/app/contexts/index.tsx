import { ConfigProvider, theme } from "antd";
import { setCookie } from "nookies";
import { useLoaderData } from "@remix-run/react"
import { blue } from '@ant-design/colors'
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);


export const COOKIE_MODE = "_m";

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  
  const { themeMode } = useLoaderData();
  const [mode, setMode] = useState(themeMode);

  useEffect(() => {
    // detect theme if no existing cookie
    if (!themeMode) {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const darkModeOn = darkModeMediaQuery.matches;
      setMode(darkModeOn ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // set theme from cookie
    const domain = window.location.hostname.split(".").slice(-2).join(".");
    setCookie(null, COOKIE_MODE, mode, {
      domain
    });
  }, [mode]);

  const setColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        // you can change the theme colors here. example: ...RefineThemes.Magenta,
        theme={{
          token: {
            colorPrimary: mode === "light" ? blue[6] : blue[5],
          },
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
