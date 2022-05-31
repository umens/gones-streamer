import React from "react";
import { IObsRemote } from "../";
import { Row, Col, Alert } from "antd";
// import { UserOutlined, SearchOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// import FilterResults from 'react-filter-search';
import './PlayerControl.css';
// import { Player } from "../../Models";
// import { v4 as uuidv4 } from 'uuid';
// import { Utilities } from "../../Utils";

type PlayerControlProps = typeof PlayerControl.defaultProps & {
  ObsRemote: IObsRemote;
};
type PlayerControlState = {
  searchValue: string;
  showingPlayer: string | null;
};
class PlayerControl extends React.Component<PlayerControlProps, PlayerControlState> {

  static defaultProps = {
    editable: false,
  };

  constructor(props: Readonly<PlayerControlProps>) {
    super(props);
    this.state = {
      searchValue: '',
      showingPlayer: null,
    };
  }

  shouldComponentUpdate = (nextProps: Readonly<PlayerControlProps>, nextState: Readonly<PlayerControlState>, nextContext: any): boolean => {
    if(nextProps.ObsRemote.coreStats !== this.props.ObsRemote.coreStats || nextProps.ObsRemote.streamingStats !== this.props.ObsRemote.streamingStats) {
      return false;
    }
    return true;
  }

  componentDidMount = () => {
  }
  
  showPlayer = async (uuid: string): Promise<void> => {
    try {
      await this.setState({ showingPlayer: uuid });
      await this.props.ObsRemote.togglePlayerHighlight(true, uuid);
    } catch (error) {
      
    }
  }
  
  hidePlayer = async (uuid: string): Promise<void> => {
    try {
      await this.props.ObsRemote.togglePlayerHighlight(false, uuid);
      await this.setState({ showingPlayer: null });
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <>        
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Alert
              message="Feature in progress"
              description="Vous pourrez mettre un spotlight sur un joueur à partir de cet endroit."
              type="info"
              showIcon
            />
            {/* <Input 
              placeholder="Rechercher un joueur"
              onChange={e => this.setState({searchValue: e.target.value})}
              suffix={<SearchOutlined />}
            />
            <FilterResults
              value={this.state.searchValue}
              data={this.props.ObsRemote.store?.Players}
              renderResults={(results: Player[]) => (
                <List
                  style={{ marginTop: 16 }}
                  bordered={true}
                  itemLayout="horizontal"
                  dataSource={results}
                  pagination={{
                    pageSize: 3, // maybe 4
                  }}
                  renderItem={item => (
                    <List.Item
                      actions={
                        this.state.showingPlayer !== null ?
                          [<Tooltip title={this.state.showingPlayer !== item.uuid ? "Show player details" : "Hide player details"}><Button onClick={(e) => {this.state.showingPlayer !== item.uuid ? this.showPlayer(item.uuid!) : this.hidePlayer(item.uuid)}} disabled={this.state.showingPlayer !== item.uuid} type="primary" icon={this.state.showingPlayer !== item.uuid ? <EyeOutlined /> : <EyeInvisibleOutlined />} /></Tooltip>]
                        :
                        [<Tooltip title="Show player details"><Button onClick={(e) => this.showPlayer(item.uuid!)} disabled={false} type="primary" icon={<EyeOutlined />} /></Tooltip>]
                        }
                    >
                      <List.Item.Meta
                        avatar={item.media ? <Avatar src={item.media} /> : <Avatar icon={<UserOutlined />} />}
                        title={item.lastname.toUpperCase() + ' ' + Utilities.capitalize(item.firstname.toLowerCase())}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </List.Item>
                  )}
                />
              )}
            /> */}
          </Col>
        </Row>
      </>
    );
  }
};

export { PlayerControl };
