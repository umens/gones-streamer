import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import { Layout, Menu } from 'antd';
// import { BasicLayout } from './Layouts';
import { Cockpit, Settings } from './Pages';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
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
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 80 }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <Switch>              
              <Route exact path="/" component={Cockpit} />
              <Route path="/settings" component={Settings}/>
            </Switch>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Router>
  );
}

export default App;
