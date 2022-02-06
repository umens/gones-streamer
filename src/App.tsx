import {
  Route,
  Link,
  Routes
} from "react-router-dom";
import { Layout, Menu } from 'antd';

import './App.css';
import { Cockpit, Settings } from './Pages';
import { ObsRemote, IObsRemote } from './Components';

const { Header, Content } = Layout;

type AppProps = {
}

const App = (props: AppProps) => {

  return (
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
            </Menu>
          </Header>
          <Content className="site-layout" style={{ padding: '0 50px', marginTop: 80 }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
              <Routes>
                <Route path="/" element={<Cockpit ObsRemote={ObsRemoteState} />} />
                <Route path="/settings" element={<Settings ObsRemote={ObsRemoteState} />} />
              </Routes>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      )}
    </ObsRemote>
  );
}

export default App;
