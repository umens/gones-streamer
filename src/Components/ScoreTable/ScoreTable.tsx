import React from "react";
import { IObsRemote } from "../";
import { Button, Menu, Dropdown, Space, Row, Col } from "antd";
import { DownOutlined } from '@ant-design/icons';
import './ScoreTable.css';
import { ScoreType } from "../../Models";

type ScoreTableProps = {
  ObsRemote: IObsRemote;
  isHomeTeam: boolean;
};
type ScoreTableState = {
};
class ScoreTable extends React.Component<ScoreTableProps, ScoreTableState> {

  constructor(props: Readonly<ScoreTableProps>) {
    super(props);
    this.state = {
    };
  }

  handleMenuClick = (scoreType: ScoreType) => async (e: any) => {
    try {
      await this.props.ObsRemote.setScore(this.props.isHomeTeam, scoreType);
    } catch (error) {
      
    }
  }
  
  render() {
    const menu = (
      <Menu key={`extramenu-${(this.props.isHomeTeam) ? 'home': 'away'}`} >
        <Menu.Item key={`pat-${(this.props.isHomeTeam) ? 'home': 'away'}`} onClick={this.handleMenuClick(ScoreType.PAT)}>PAT</Menu.Item>
        <Menu.Item key={`extrap-${(this.props.isHomeTeam) ? 'home': 'away'}`} onClick={this.handleMenuClick(ScoreType.EXTRAPOINT)}>2 points</Menu.Item>
      </Menu>
    );

    let team = (this.props.isHomeTeam) ? this.props.ObsRemote.store?.GameStatut?.HomeTeam : this.props.ObsRemote.store?.GameStatut?.AwayTeam;

    return (
      <>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={24}>
            <Button key={`possession-${(this.props.isHomeTeam) ? 'home': 'away'}`} type="primary" block>
              Primary
            </Button>
          </Col>
        </Row>
        
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={24}>
            <Space>
              <Button key={`td-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} onClick={this.handleMenuClick(ScoreType.TOUCHDOWN)} type="primary">Touchdown</Button>
              <Button key={`safety-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} onClick={this.handleMenuClick(ScoreType.SAFETY)} type="primary">Safety</Button>
              <Button key={`fg-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} type="primary" onClick={this.handleMenuClick(ScoreType.FIELDGOAL)}>Field Goal</Button>
              <Dropdown overlay={menu}>
                <Button key={`extra-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} type="primary">Extra Point <DownOutlined /></Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </>
    );
  }
};

export { ScoreTable };
