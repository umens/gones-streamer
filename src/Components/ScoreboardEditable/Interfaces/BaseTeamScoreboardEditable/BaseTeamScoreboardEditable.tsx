import { IObsRemote } from "../../..";
import './BaseTeamScoreboardEditable.css';

type BaseTeamScoreboardEditableProps = {
  ObsRemote: IObsRemote;
  isHomeTeam: boolean;
};
type BaseTeamScoreboardEditableState = {
  visibleModal: boolean;
  visibleModalTeam: boolean;
  confirmLoading: boolean;
  confirmLoadingTeam: boolean;
  updatedScore: number;
  updatedName: string;
  updatedCity: string;
  loadingFile: boolean;
  displayColorPicker: boolean;
};
// const withStyleTeamScoreboardEditable = (WrappedComponent: ComponentType<BaseTeamScoreboardEditablePropsChildren>) => {
//   return class BaseTeamScoreboardEditable extends React.Component<BaseTeamScoreboardEditableProps, BaseTeamScoreboardEditableState> {

//     constructor(props: Readonly<BaseTeamScoreboardEditableProps>) {
//       super(props);
//       this.state = {
//         visibleModal: false,
//         visibleModalTeam: false,
//         confirmLoading: false,
//         confirmLoadingTeam: false,
//         updatedScore: 0,
//         updatedName: 'Name',
//         updatedCity: 'City',
//         loadingFile: false,
//         displayColorPicker: false,
//       };
//     }

//     changeText = async (prop: keyof TeamModel & string, value: string) => {
//       try {
//         await this.props.ObsRemote.updateTextProps({ props: prop, value, homeTeam: this.props.isHomeTeam });
//       } catch (error) {
//       }
//     }

//     showModal = () => {
//       console.log('test')
//       this.setState({
//         visibleModal: true,
//       });
//     };

//     showModalTeam = () => {
//       console.log('test')
//       this.setState({
//         visibleModalTeam: true,
//       });
//     };

//     handleOk = async () => {
//       try {
//         await this.setState({ confirmLoading: true });
//         await this.props.ObsRemote.updateTextProps({ props: 'score', value: this.state.updatedScore, homeTeam: this.props.isHomeTeam});
//         await this.setState({ visibleModal: false, confirmLoading: false });
//       } catch (error) {
//         await this.setState({ visibleModal: false, confirmLoading: false });
//       }
//     };

//     handleOkTeam = async () => {
//       try {
//         await this.setState({ confirmLoadingTeam: true });
//         await this.props.ObsRemote.updateTextProps({ props: 'name', value: this.state.updatedName, homeTeam: this.props.isHomeTeam});
//         await this.props.ObsRemote.updateTextProps({ props: 'city', value: this.state.updatedCity, homeTeam: this.props.isHomeTeam});
//         await this.setState({ visibleModalTeam: false, confirmLoadingTeam: false });
//       } catch (error) {
//         await this.setState({ visibleModalTeam: false, confirmLoadingTeam: false });
//       }
//     };

//     handleCancel = () => {
//       this.setState({ visibleModal: false });
//     };

//     handleCancelTeam = () => {
//       this.setState({ visibleModalTeam: false });
//     };

//     onChange = (value: any) => {
//       this.setState({ updatedScore: +value });
//     };

//     handleTimeout = (timeout: Timeout, team: TeamModel) => async (event: SyntheticEvent) => {
//       try {
//         let value: Timeout;
//         if (timeout <= team.timeout) {
//           value = timeout - 1;
//         } else {
//           value = timeout;
//         }
//         await this.props.ObsRemote.updateTextProps({ props: 'timeout', value, homeTeam: this.props.isHomeTeam});
//       } catch (error) {
//       }
//     }

//     beforeUpload = (file: File): boolean => {
//       const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//       if (!isJpgOrPng) {
//         message.error('You can only upload JPG/PNG file!');
//       }
//       const isLt2M = file.size / 1024 / 1024 < 2;
//       if (!isLt2M) {
//         message.error('Image must smaller than 2MB!');
//       }
//       return isJpgOrPng && isLt2M;
//     }

//     uploadElectronFile = async () => {
//       try {
//         const fileData = await window.app.selectElectronFile(true);
//         if(fileData) {
//           await this.onChangeHandler([fileData], [], null);
//         }
//       } catch (error) {
        
//       }
//     }

//     onChangeHandler = async (acceptedFiles: FileUp[], fileRejections: any[], event: any): Promise<void> => {
//       try {
//         if(this.beforeUpload(acceptedFiles[0].file)) {
//           await this.setState({ loadingFile: true });
//           const data = await window.app.setFile({ file: acceptedFiles[0]?.pathElectron, isHomeTeam: this.props.isHomeTeam });
//           await this.props.ObsRemote.updateTextProps({ props: 'logo', value: { file: acceptedFiles[0].file, pathElectron: data.split('#').shift()! }, homeTeam: this.props.isHomeTeam});
//           await this.setState({ loadingFile: false });
//         }
//       } catch (error) {

//       }
//     };

//     handleClickColorPickerBtn = () => {
//       this.setState({ displayColorPicker: !this.state.displayColorPicker })
//     };

//     handleCloseColorpicker = () => {
//       this.setState({ displayColorPicker: false })
//     };

//     handleChangeColorpicker = async (color: any) => {
//       try {
//         await this.props.ObsRemote.updateTextProps({ props: 'color', value: color.hex, homeTeam: this.props.isHomeTeam});
//       } catch (error) {

//       }
//     };

//     render(): React.ReactNode {
//       let state = this.state;
//       return (
//         <WrappedComponent
//           ObsRemote={this.props.ObsRemote}
//           isHomeTeam={this.props.isHomeTeam}
//           state={state}
//           changeText={this.changeText}
//           showModal={this.showModal}
//           showModalTeam={this.showModalTeam}
//           handleOk={this.handleOk}
//           handleOkTeam={this.handleOkTeam}
//           handleCancel={this.handleCancel}
//           handleCancelTeam={this.handleCancelTeam}
//           onChange={this.onChange}
//           handleTimeout={this.handleTimeout}
//           beforeUpload={this.beforeUpload}
//           uploadElectronFile={this.uploadElectronFile}
//           onChangeHandler={this.onChangeHandler}
//           handleClickColorPickerBtn={this.handleClickColorPickerBtn}
//           handleCloseColorpicker={this.handleCloseColorpicker}
//           handleChangeColorpicker={this.handleChangeColorpicker}
//         />
//       );
//     }

//   };
// };

// export { withStyleTeamScoreboardEditable };
export type { BaseTeamScoreboardEditableProps, BaseTeamScoreboardEditableState };
