import { ColorModeContext } from "@contexts";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  Typography,
  theme,
  Dropdown,
  MenuProps,
} from "antd";
import React, { useContext } from "react";
import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export default function Header ({
  sticky,
}: RefineThemedLayoutV2HeaderProps) {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [ isAuthApp, setIsAuthApp ] = useState(false);
  const [ hostname, setHostname ] = useState("");

  useEffect(() => {
    setIsAuthApp(window.location.hostname.split(".")[0] === "auth");
    const path = window.location.host.split(".").slice(-2).join(".");
    setHostname(`//auth.${path}`);
  }, []);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const items: MenuProps['items'] = [
    {
      key: "profile",
      label: "Perfil",
      onClick: () => {
        if (isAuthApp) {
          navigate(`/me`);
        } else {
          window.location.href = `${hostname}/me`;
        }
      }
    },
    {
      key: "apps",
      label: "Mis aplicaciones",
      onClick: () => {
        if (isAuthApp) {
          navigate(`/apps`);
        } else {
          window.location.href = `${hostname}/apps`;
        }
      }
    },
    {
      key: "logout",
      label: "Cerrar sesión",
      onClick: () => logout(),
    }
  ]

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar? <Avatar src={user?.avatar} alt={user?.name} />:
              <Avatar src="https://i.imgur.com/6VBx3io.png" alt="avatar" />
            }
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};

