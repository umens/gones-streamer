import React from "react";
import { IObsRemote } from "../";
import { Button, Menu, Dropdown, Row, Col } from "antd";
import { DownOutlined, CrownOutlined } from '@ant-design/icons';
import './ScoreTable.css';
import { ScoreType, TeamPossession } from "../../Models";

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
      await this.props.ObsRemote.setScore({ isHomeTeam: this.props.isHomeTeam, scoreType, withAnimation: true });
    } catch (error) {
      
    }
  }

  handlePossession = async (e: any) => {
    try {
      await this.props.ObsRemote.changePossession();
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

    // let team = (this.props.isHomeTeam) ? this.props.ObsRemote.store?.GameStatut?.HomeTeam : this.props.ObsRemote.store?.GameStatut?.AwayTeam;
    const text = (this.props.isHomeTeam && this.props.ObsRemote.store?.GameStatut.Options.possession === TeamPossession.HOME) || (!this.props.isHomeTeam && this.props.ObsRemote.store?.GameStatut.Options.possession === TeamPossession.AWAY) ? <span><CrownOutlined /> a le ballon</span> : "Changez la possession";

    return (
      <>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={24}>
            <Button 
              key={`possession-${(this.props.isHomeTeam) ? 'home': 'away'}`} 
              onClick={this.handlePossession} 
              disabled={(this.props.isHomeTeam && this.props.ObsRemote.store?.GameStatut.Options.possession === TeamPossession.HOME) || (!this.props.isHomeTeam && this.props.ObsRemote.store?.GameStatut.Options.possession === TeamPossession.AWAY)} 
              type="primary" 
              block
            >
              {text}
            </Button>
          </Col>
        </Row>
        
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Button key={`td-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} onClick={this.handleMenuClick(ScoreType.TOUCHDOWN)} type="primary" block>Touchdown</Button>
          </Col>
          <Col span={6}>
              <Button key={`safety-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} onClick={this.handleMenuClick(ScoreType.SAFETY)} type="primary" block>Safety</Button>
          </Col>
          <Col span={6}>
              <Button key={`fg-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} type="primary" onClick={this.handleMenuClick(ScoreType.FIELDGOAL)} block>Field Goal</Button>
          </Col>
          <Col span={6}>
            <Dropdown overlay={menu}>
              <Button key={`extra-${(this.props.isHomeTeam) ? 'home': 'away'}`} ghost={!this.props.isHomeTeam} type="primary" block>Extra Point <DownOutlined /></Button>
            </Dropdown>
          </Col>
        </Row>
      </>
    );
  }
};

export { ScoreTable };
