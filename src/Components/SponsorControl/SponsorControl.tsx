import React from "react";
import { IObsRemote, SponsorForm, VideoPreview } from "../";
import { Button, Row, Col, Tooltip, Input, List, Card, Image } from "antd";
import { SearchOutlined, EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import FilterResults from 'react-filter-search';
import './SponsorControl.css';
import { MediaType, SceneName, Sponsor, SponsorDisplayType } from "../../Models";
import { Utilities } from "../../Utils";

type SponsorControlProps = typeof SponsorControl.defaultProps & {
  ObsRemote: IObsRemote;
};
type SponsorControlState = {
  searchValue: string;
  showingSponsor: string | null;
  previousScene?: SceneName;
  visibleModal: boolean;
  deleteLoading: boolean[];
  initialValuesForm?: Sponsor;
  loadingForm: boolean;
};
class SponsorControl extends React.Component<SponsorControlProps, SponsorControlState> {
  
  static defaultProps = {
    editable: false,
  };
  timeout?: NodeJS.Timeout;

  constructor(props: Readonly<SponsorControlProps>) {
    super(props);
    this.state = {
      searchValue: '',
      showingSponsor: null,
      visibleModal: false,
      deleteLoading: [],
      loadingForm: false,
    };
  }

  componentDidMount = () => {
  }
  
  showSponsor = async (uuid: string, sponsorDisplayType: SponsorDisplayType): Promise<void> => {
    try {
      const store = this.props.ObsRemote.store!;
      const sponsor: Sponsor | undefined = store.Sponsors.find(p => p.uuid === uuid);
      let delay = sponsor?.mediaType === MediaType.Video ? sponsor.duration! * 1000 : 10000;
      await this.setState({ showingSponsor: uuid, previousScene: this.props.ObsRemote.scenes?.currentScene as SceneName });
      await this.props.ObsRemote.toggleSponsor({ show: true, uuid, previousScene: this.state.previousScene!, sponsorDisplayType });
      this.timeout = setTimeout(async () => {
        await this.props.ObsRemote.toggleSponsor({ show: false, uuid, previousScene: this.state.previousScene!, sponsorDisplayType });
        this.timeout = undefined;
        await this.setState({ showingSponsor: null, previousScene: undefined });
      }, delay);
    } catch (error) {
      
    }
  }
  
  hideSponsor = async (uuid: string): Promise<void> => {
    try {
      if(this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
      await this.props.ObsRemote.toggleSponsor({ show: false, uuid, previousScene: this.state.previousScene! });
      await this.setState({ showingSponsor: null, previousScene: undefined });
    } catch (error) {
      
    }
  }
  
  createSponsor = async (values: Sponsor): Promise<void> => {
    try {
      await this.setState({ loadingForm: true });
      let newSponsors;
      values.label = values.label.charAt(0).toUpperCase() + values.label.slice(1).toLowerCase();
      if(values.uuid) {
        newSponsors = await window.app.manageSponsors({ action: 'edit', sponsor: values });
      } else {
        newSponsors = await window.app.manageSponsors({ action: 'add', sponsor: values });
      }
      await this.props.ObsRemote.updateSponsorsList(newSponsors);
      await this.setState({ visibleModal: false, initialValuesForm: undefined, loadingForm: false });
      this.forceUpdate()
    } catch (error) {
      
    }
  }
  
  editSponsor = async (uuid: string): Promise<void> => {
    try {
      let sponsor: Sponsor = {...this.props.ObsRemote.store!.Sponsors.find(p => p.uuid === uuid)!};
      sponsor.media = undefined;
      await this.setState({ initialValuesForm: sponsor });
      await this.setState({ visibleModal: true });
    } catch (error) {
      
    }
  }
  
  deleteSponsor = async (uuid: string, id: number): Promise<void> => {
    try {
      await this.setState(({ deleteLoading }) => {
        const newLoadings = [...deleteLoading];
        newLoadings[id] = true;
  
        return {
          deleteLoading: newLoadings,
        };
      });
      let newSponsors = await window.app.manageSponsors({ action: 'delete', id: uuid });
      await this.props.ObsRemote.updateSponsorsList(newSponsors);
      await this.setState(({ deleteLoading }) => {
        const newLoadings = [...deleteLoading];
        newLoadings[id] = false;
  
        return {
          deleteLoading: newLoadings,
          visibleModal: false
        };
      });
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Input 
              placeholder="Rechercher un sponsor"
              onChange={e => this.setState({searchValue: e.target.value})}
              suffix={<SearchOutlined />}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col span={24}>            
            <FilterResults
              value={this.state.searchValue}
              data={this.props.ObsRemote.store?.Sponsors ? this.props.ObsRemote.store?.Sponsors : []}
              renderResults={(results: Sponsor[]) => {
                if(this.props.editable) {
                  results.push({label: "add"});
                }
                return (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 4,
                      sm: 4,
                      md: 4,
                      lg: 4,
                      xl: 4,
                      xxl: 4,
                    }}
                    style={{ marginTop: 16 }}
                    itemLayout="horizontal"
                    dataSource={results}
                    renderItem={(item: Sponsor, index: number) => {                    
                      if(this.props.editable && results.length - 1 === index) {
                        return (
                          <Card bordered={false}>
                            <Row align="middle" justify="center" style={{ height: 213 }}>
                              <Col>
                                <Button
                                  block
                                  icon={<PlusOutlined />} 
                                  // style={{ height: 213 }}
                                  onClick={async () => {
                                    await this.setState({ visibleModal: true });
                                  }}
                                >
                                  Nouveau sponsor
                                </Button>
                              </Col>
                            </Row>
                            <SponsorForm
                              loadingForm={this.state.loadingForm}
                              initialValues={this.state.initialValuesForm}
                              visible={this.state.visibleModal}
                              onCreate={this.createSponsor}
                              onCancel={async () => {
                                await this.setState({ visibleModal: false, initialValuesForm: undefined });
                              }}
                            />
                          </Card>
                        )
                      } else {
                        return (
                          <Card
                            cover={
                              item.media && item.mediaType === MediaType.Video ?
                              <VideoPreview interval={500} images={[...Array(5).keys()].map((value: number) => {
                                const path = (item as Sponsor).media!.split('\\');
                                const file = path.pop()!;
                                const uuid = file.substr(0,file.lastIndexOf('.'));
                                return `${path.join('/')}/${uuid}/${uuid}_thumb-${value + 1}.jpg`;
                              })}/>
                              :
                              <Image
                                width={246}
                                preview={false}
                                style={{ margin: "auto", display: "block" }}
                                height={139}
                                src={item.media}
                                fallback="data:image/png;base64,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"
                              />
                            }
                            actions={
                              this.props.editable ?
                                [
                                  <Tooltip title="Editer">
                                    <Button 
                                      type="text" 
                                      onClick={async (e) => { await this.editSponsor(item.uuid!)}}
                                      icon={<EditOutlined />} 
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Supprimer">
                                    <Button 
                                      type="text" 
                                      loading={this.state.deleteLoading[index]}
                                      onClick={async (e) => { await this.deleteSponsor(item.uuid!, index)}}
                                      icon={<DeleteOutlined />} 
                                    />
                                  </Tooltip>,
                                ] :
                                this.state.showingSponsor !== null ?
                                  this.state.showingSponsor !== item.uuid ?
                                    [
                                      <Tooltip title="Show small sponsor">
                                        <Button 
                                          type="text" 
                                          onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Small)}} 
                                          disabled={true} 
                                          icon={<EyeOutlined />} 
                                        />
                                      </Tooltip>,
                                      <Tooltip title="Show big sponsor">
                                        <Button 
                                          type="text" 
                                          onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Big)}} 
                                          disabled={true} 
                                          icon={<EyeOutlined />} 
                                        />
                                      </Tooltip>,
                                      <Tooltip title="Show fullscreen sponsor">
                                        <Button 
                                          type="text" 
                                          onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Fullscreen)}} 
                                          disabled={true} 
                                          icon={<EyeOutlined />} 
                                        />
                                      </Tooltip>
                                    ] 
                                    :
                                    [
                                      <Tooltip title="Hide sponsor">
                                        <Button 
                                          type="text" 
                                          onClick={async (e) => { await this.hideSponsor(item.uuid!)}}
                                          icon={<EyeInvisibleOutlined />} 
                                        />
                                      </Tooltip>
                                    ]
                                :
                                [
                                  <Tooltip title="Show small sponsor">
                                    <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Small)} disabled={false} icon={<EyeOutlined />} />
                                  </Tooltip>,
                                  <Tooltip title="Show big sponsor">
                                    <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Big)} disabled={false} icon={<EyeOutlined />} />
                                  </Tooltip>,
                                  <Tooltip title="Show fullscreen sponsor">
                                    <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Fullscreen)} disabled={false} icon={<EyeOutlined />} />
                                  </Tooltip>,
                                ]
                            }
                          >
                            <Card.Meta
                              title={Utilities.capitalize(item.label.toLowerCase())}
                            />
                          </Card>
                        )
                      }
                    }}
                  />
                )
              }}
            />            
          </Col>
        </Row>
      </>
    );
  }
};

export { SponsorControl };
