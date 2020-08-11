import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Avatar, Button, Tooltip } from 'antd';
import { ApiFilled, WifiOutlined, LoadingOutlined } from '@ant-design/icons';
// import { BasicLayout } from './Layouts';
import { Cockpit, Settings } from './Pages';
import { ObsRemote, IObsRemote } from './Components';

const { Header, Content } = Layout;

function App() {

  return (
    <Router>
      <ObsRemote>
        {( ObsRemoteState: IObsRemote ) => (
          <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/']}>
                <Menu.Item key="/">
                  <Link to="/">Cockpit</Link>
                </Menu.Item>
                <Menu.Item key="/settings">
                  <Link to="/settings">Settings</Link>
                </Menu.Item>
                <div style={{ float: "right" }}>
                  {(() => { if (ObsRemoteState.connectingObs) {
                      return <Tooltip title="Connexion à OBS"><Avatar shape='square' size="large" style={{ color: '#1890ff' }} icon={<LoadingOutlined />} /></Tooltip>;
                    } else {
                      if (ObsRemoteState.connected2Obs) {
                        return <Tooltip title="Connecté à OBS"><Avatar shape='square' size="large" style={{ color: '#52c41a' }} icon={<WifiOutlined />} /></Tooltip>;
                      } else {
                        return <Tooltip title="Non connecté à OBS"><Button type="text" size="large" style={{ color: '#ff4d4f', backgroundColor: '#ffffff4d' }} icon={<ApiFilled />} onClick={ObsRemoteState.reconnectObs}/></Tooltip>;
                      }
                    }
                  })()}
                </div>
              </Menu>
            </Header>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 80 }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                <Switch>
                  <Route exact path="/">
                    <Cockpit ObsRemote={ObsRemoteState} />
                  </Route>
                  <Route exact path="/settings">
                    <Settings ObsRemote={ObsRemoteState} />
                  </Route>
                </Switch>
              </div>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
          </Layout>
        )}
      </ObsRemote>
    </Router>
  );
}

export default App;
