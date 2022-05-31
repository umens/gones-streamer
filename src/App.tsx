import React from 'react';
import {
  Route,
  Link,
  Routes
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Avatar, Button, Tooltip } from 'antd';
import { ApiFilled, WifiOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';
// import { BasicLayout } from './Layouts';
import { Cockpit, Settings } from './Pages';
import { IObsRemote } from './Components';
import { ThemeProvider } from './Themes/themeProvider';

const { Header, Content } = Layout;

type AppProps = {
  ObsRemote: IObsRemote
}

const App = (props: AppProps) => {

  return (
    <ThemeProvider>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/']}>
            <Menu.Item key="/">
              <Link to="/">Cockpit</Link>
            </Menu.Item>
            <Menu.Item key="/settings" icon={<SettingOutlined />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
            <div style={{ float: 'right' }}>
              {(() => { if (props.ObsRemote.connectingObs) {
                  return <Tooltip title="Connexion à OBS"><Avatar shape='square' size="large" style={{ color: '#1890ff' }} icon={<LoadingOutlined />} /></Tooltip>;
                } else {
                  if (props.ObsRemote.connected2Obs) {
                    return <Tooltip title="Connecté à OBS"><Avatar shape='square' size="large" style={{ color: '#52c41a' }} icon={<WifiOutlined />} /></Tooltip>;
                  } else {
                    return <Tooltip title="Non connecté à OBS"><Button type="text" size="large" style={{ color: '#ff4d4f', backgroundColor: '#ffffff4d' }} icon={<ApiFilled />} onClick={props.ObsRemote.reconnectObs}/></Tooltip>;
                  }
                }
              })()}
            </div>
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 80 }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<Cockpit ObsRemote={props.ObsRemote} />} />
              <Route path="/settings" element={<Settings ObsRemote={props.ObsRemote} />} />
            </Routes>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
