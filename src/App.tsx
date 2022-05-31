import React from 'react';
import {
  Route,
  Link,
  Routes
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Avatar, Button, Tooltip } from 'antd';
import { ApiFilled, WifiOutlined, LoadingOutlined, SettingOutlined,  } from '@ant-design/icons';
import type { MenuProps } from 'antd';
// import { BasicLayout } from './Layouts';
import { Cockpit, Settings } from './Pages';
import { IObsRemote } from './Components';
import { ThemeProvider } from './Themes/themeProvider';

const { Header, Content } = Layout;

type AppProps = {
  ObsRemote: IObsRemote
}

const App = (props: AppProps) => {

  // const connected = () => { 
  //   if (props.ObsRemote.connectingObs) {
  //     return <div style={{marginLeft: 'auto'}}><Tooltip title="Connexion à OBS"><Avatar shape='square' size="large" style={{ color: '#1890ff' }} icon={<LoadingOutlined />} /></Tooltip></div>;
  //   } else {
  //     if (props.ObsRemote.connected2Obs) {
  //       return <div style={{marginLeft: 'auto'}}><Tooltip title="Connecté à OBS"><Avatar shape='square' size="large" style={{ color: '#52c41a' }} icon={<WifiOutlined />} /></Tooltip></div>;
  //     } else {
  //       return <div style={{marginLeft: 'auto'}}><Tooltip title="Non connecté à OBS"><Button type="text" size="large" style={{ color: '#ff4d4f', backgroundColor: '#ffffff4d' }} icon={<ApiFilled />} onClick={props.ObsRemote.reconnectObs}/></Tooltip></div>;
  //     }
  //   }
  // }


  const items: MenuProps['items'] = [
    { label: <Link to="/">Cockpit</Link>, key: 'item-1' }, 
    { label: <Link to="/settings">Settings</Link>, icon: <SettingOutlined />, key: 'item-2' }, 
    // { 
    //   label: connected(),
    //   key: 'item-3',
    //   disabled: true
    // },
  ];

  return (
    <ThemeProvider>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />          
          <Menu items={items} theme="dark" mode="horizontal" defaultSelectedKeys={['/']} />
          <div style={{ float: 'right', position: 'relative', top: -66 }}>
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
