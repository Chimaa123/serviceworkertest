import React from "react";
import { Tabs, Typography } from "antd";
import "../../design/ css/navigation.style.css";
import { UnorderedListOutlined, CameraOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { TabPane } = Tabs;
const { Text } = Typography;

type Props = {};

const tabs = [
  {
    route: "/tmap",
    icon: <UnorderedListOutlined />,
    label: "Home",
  },
  {
    route: "/camera",
    icon: <CameraOutlined />,
    label: "Search",
  },
];

const Navigation = (props: Props) => {
  return (
    <nav className={"navbar"}>
      <Tabs>
        {tabs.map((tab, index) => (
          <TabPane className="nav-link" tab={tab.label} key={index + "tab"}>
            <NavLink to={tab.route} activeClassName="active">
              <div className="row d-flex flex-column justify-content-center align-items-center">
                {tab.icon}
                <Text strong>{tab.label}</Text>
              </div>
            </NavLink>
          </TabPane>
        ))}
      </Tabs>
    </nav>
  );
};

const styles = {
  tabs: {
    overflow: "hidden",
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
};
export default Navigation;
