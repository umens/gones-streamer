// Modified from https://github.com/stream-labs/streamlabs-obs/blob/staging/app/util/operating-systems.ts

export const OS = {
  Windows: 'win32',
  Mac: 'darwin',
};

export function byOS(handlers: { [x: string]: unknown; }) {
  const handler = handlers[process.platform];

  if (typeof handler === 'function') return handler();

  return handler;
}

export function getOS() {
  return process.platform;
}

// Enums
export const enum EOBSOutputType {
  Streaming = 'streaming',
  Recording = 'recording',
  ReplayBuffer = 'replay-buffer',
}

export const enum EOBSOutputSignal {
  Starting = 'starting',
  Start = 'start',
  Activate = 'activate',
  Stopping = 'stopping',
  Stop = 'stop',
  Deactivate = 'deactivate',
  Reconnect = 'reconnect',
  ReconnectSuccess = 'reconnect_success',
  Writing = 'writing',
  Wrote = 'wrote',
  WriteError = 'writing_error',
}


export const enum ESceneDupType {
  Refs,
  Copy,
  PrivateRefs,
  PrivateCopy
}

export const enum EOBSInputTypes {
  AudioLine = 'audio_line',
  ImageSource = 'image_source',
  ColorSource = 'color_source',
  Slideshow = 'slideshow',
  BrowserSource = 'browser_source',
  FFMPEGSource = 'ffmpeg_source',
  TextGDI = 'text_gdiplus',
  TextFT2 = 'text_ft2_source',
  VLCSource = 'vlc_source',
  MonitorCapture = 'monitor_capture',
  WindowCapture = 'window_capture',
  GameCapture = 'game_capture',
  DShowInput = 'dshow_input',
  WASAPIInput = 'wasapi_input_capture',
  WASAPIOutput = 'wasapi_output_capture',
  Group = 'group',
  DShowInputReplay = 'dshow_input_replay',
  ReplaySource = 'replay_source',
}

export const enum EOBSFilterTypes {
  FaceMask = 'face_mask_filter',
  Mask = 'mask_filter',
  Crop = 'crop_filter',
  Gain = 'gain_filter',
  Color = 'color_filter',
  Scale = 'scale_filter',
  Scroll = 'scroll_filter',
  GPUDelay = 'gpu_delay',
  ColorKey = 'color_key_filter',
  Clut = 'clut_filter',
  Sharpness = 'sharpness_filter',
  ChromaKey = 'chroma_key_filter',
  AsyncDelay = 'async_delay_filter',
  NoiseSuppress = 'noise_suppress_filter',
  InvertPolarity = 'invert_polarity_filter',
  NoiseGate = 'noise_gate_filter',
  Compressor = 'compressor_filter',
  Limiter = 'limiter_filter',
  Expander = 'expander_filter',
  LumaKey = 'luma_key_filter',
  NDI = 'ndi_filter',
  NDIAudio ='ndi_audiofilter',
  PremultipliedAlpha = 'premultiplied_alpha_filter',
  VST = 'vst_filter'
}

export const enum EOBSTransitionTypes {
  Cut = 'cut_transition',
  Fade = 'fade_transition',
  Swipe = 'swipe_transition',
  Slide = 'slide_transition',
  Stinger = 'obs_stinger_transition',
  FadeToColor = 'fade_to_color_transition',
  Wipe = 'wipe_transition'
}

export const enum EOBSSettingsCategories {
  General = 'General',
  Stream = 'Stream',
  Output = 'Output',
  Audio = 'Audio',
  Video = 'Video',
  Hotkeys = 'Hotkeys',
  Advanced = 'Advanced'
}

export const enum ETestErrorMsg {
  // nodeobs_api
  GetPerformanceStatistics = 'Get performance statistics',
  ShowHideInputHotkeys = 'Show hide hotkey container is wrong',
  SlideShowHotkeys = 'Slideshow hotkey container is wrong',
  FFMPEGSourceHotkeys = 'FFMPEG source hotkey container is wrong',
  GameCaptureHotkeys = 'Game capture hotkey container is wrong',
  DShowInputHotkeys = 'DShow input hotkey container is wrong',
  WASAPIInputHotkeys = 'WASAPI input hotkey container is wrong',
  WASAPIOutputHotkeys = 'WASAPI output hotkey container is wrong',
  // nodeobs_autoconfig
  BandwidthTest = 'Bandwidth test',
  StreamEncoderTest = 'Stream encoder test',
  RecordingEncoderTest = 'Recording encoder test',
  CheckSettings = 'Check settings',
  SaveStreamSettings = 'Save stream settings',
  SaveSettingsStep = 'Save settings',
  SetDefaultSettings = 'Set default settings',
  DefaultOutputMode = 'Applied default settings does not have the expected value for output mode',
  DefaultVBitrate = 'Applied default settings does not have the expected value for vbitrate',
  DefaultStreamEncoder = 'Applied default settings does not have the expected value for stream encoder',
  DefaultRecQuality = 'Applied default settings does not have the expected value for rec quality',
  DefaultDinamicBitrate = 'Applied default settings does not have the expected value for dinamic bitrate',
  DefaultVideoOutput = 'Applied default settings does not have the expected value for video output',
  DefaultFPSType = 'Applied default settings does not have the expected value for fps type',
  DefaultFPSCommon = 'Applied default settings does not have the expected value for fps common',
  // nodeobs_service
  StreamOutput = 'Stream output',
  RecordingOutput = 'Recording output',
  ReplayBuffer = 'Replay buffer',
  StreamOutputDidNotStart = 'Stream output failed to start | Error code: %VALUE1% / Error message: %VALUE2%',
  StreamOutputStoppedWithError = 'Stream ouput stopped with error | Error code: %VALUE1% / Error message: %VALUE2%',
  RecordOutputDidNotStart = 'Record output failed to start | Error code: %VALUE1% / Error message: %VALUE2%',
  RecordOutputStoppedWithError = 'Record ouput stopped with error | Error code: %VALUE1% / Error message: %VALUE2%',
  ReplayBufferDidNotStart = 'Replay buffer failed to start | Error code: %VALUE1% / Error message: %VALUE2%',
  ReplayBufferStoppedWithError = 'Replay buffer stopped with error | Error code: %VALUE1% / Error message: %VALUE2%',
  // nodeobs_settings
  GeneralSettings = 'One or more general settings failed to be updated',
  SingleGeneralSetting = 'Failed to update general setting %VALUE1%',
  StreamSettings = 'One or more stream setting failed to be updated',
  SingleStreamSetting = 'Failed to update stream setting %VALUE1%',
  OutputSettings = 'One or more output setting failed to be updated',
  SingleOutputSetting = 'Failed to update ouput setting %VALUE1%',
  VideoSettings = 'One or more video setting failed to be updated',
  SingleVideoSetting = 'Failed to update video setting %VALUE1%',
  AdvancedSettings = 'One or more advanced setting failed to be updated',
  EmptyCategoriesList = 'Got empty list of settings categories',
  CategoriesListIsMissingValue = 'List of settings categories is missing a category',
  // osn-fader
  CreateFader = 'Failed to create %VALUE1% fader',
  GetDecibel = 'Failed to get decibel value of fader %VALUE1%',
  Decibel = 'Decibel value of fade %VALUE1% is wrong',
  GetDeflection= 'Failed to get deflection value of fader %VALUE1%',
  Deflection = 'Deflection value is wrong',
  GetMultiplier= 'Failed to get multiplier value of fader %VALUE1%',
  Multiplier = 'Multiplier value is wrong',
  // osn-filter
  CreateFilter = 'Failed to create filter %VALUE1%',
  FilterId = 'Filter %VALUE1% id value is wrong',
  FilterName = 'Filter %VALUE1% name is wrong',
  FilterSetting = 'Failed to update settings of filter %VALUE1%',
  // osn-global
  NoInputInChannel = 'There were no inputs in channel %VALUE1%',
  InputFromChannelId = 'Input returned from channel has wrong type',
  InputFromChannelName = 'Input returned from channel has wrong name',
  ChannelNotEmpty = 'Channel %VALUE1% was not empty',
  GetOutputFlags = 'Failed to get output flags from input id %VALUE1%',
  LaggedFrames = 'Failed to get lagged frames value',
  TotalFrames = 'Failed to get total frames value',
  Locale = 'Failed to update locale',
  // osn-input
  CreateInput = 'Failed to create input %VALUE1%',
  InputId = 'Input %VALUE1% id value is wrong',
  InputName = 'Input %VALUE1% name value is wrong',
  InputSetting = 'Failed to update one or more settings of input %VALUE1%',
  InputFromName = 'Failed to get input from name %VALUE1%',
  FromNameInputName = 'Input returned from name %VALUE% has wrong name',
  FromNameInputId = 'Input returned from name %VALUE1% has wrong id',
  Volume = 'Failed to update volume of input %VALUE1%',
  SyncOffset = 'Failed to update sync offset of input %VALUE1%',
  AudioMixers = 'Failed to update audio mixers of input %VALUE1%',
  MonitoringType = 'Failed to update monitoring type of input %VALUE1%',
  FindFilter = 'Did not found filter %VALUE1% in input %VALUE2%',
  RemoveFilter = 'Not all filters were removed',
  MoveFilterDown = 'Failed to move filter %VALUE1% down',
  MoveFilterUp = 'Failed to move filter %VALUE1% up',
  MoveFilterBottom = 'Failed to move filter %VALUE1% to bottom',
  MoveFilterTop = 'Failed to move filter %VALUE1% to top',
  // osn-module
  OpenModule = 'Failed to open module %VALUE1%',
  Modules = 'Failed to get all opened modules',
  // osn-scene
  CreateScene = 'Failed to create scene %VALUE1%',
  SceneId = 'Scene %VALUE1% id value is wrong',
  SceneName = 'Scene %VALUE1% name value is wrong',
  SceneType = 'Scene %VALUE1% type value is wrong',
  DuplicateScene = 'Failed to duplicate scene %VALUE1%',
  DuplicateSceneId = 'Duplicate instance of scene %VALUE1% has wrong id',
  DuplicateSceneName = 'Duplicate instance of scene %VALUE1% has wrong name',
  DuplicateSceneType = 'Duplicate instance of scene %VALUE1% has wrong type',
  SceneFromName = 'Failed to get scene from name %VALUE1%',
  SceneFromNameId = 'From name instance of scene %VALUE1% has wrong id',
  SceneFromNameName = 'From name instance of scene %VALUE1% has wrong name',
  SceneFromNameType = 'From name instance of scene %VALUE1% has wrong type',
  AddSourceToScene = 'Failed to add %VALUE1% input to scene %VALUE2%',
  SceneItemInputId = 'Scene item input %VALUE1% has the wrong id value',
  SceneItemInputName = 'Scene item input %VALUE1% has the wrong name value',
  SceneItemById = 'Failed to find scene item using id %VALUE1%',
  GetSceneItems = 'Scene %VALUE1% does not have the right number of scene items',
  SceneItemPosition = 'Wrong position for scene item with input %VALUE1%',
  SceneItemPositionAfterMove = 'After moving, wrong position of scene item with input %VALUE1%',
  // osn-sceneitem'
  GetSourceFromSceneItem = 'Failed to get source from scene item with id %VALUE1%',
  SourceFromSceneItemId = 'Source returned from scene item with id %VALUE1% has wrong id',
  SourceFromSceneItemName = 'Source returned from scene item with id %VALUE1% has wrong name',
  GetSceneFromSceneItem = 'Failed to get scene from scene item with id %VALUE1%',
  SceneFromSceneItemId = 'Scene returned from scene item with id %VALUE1$ has wrong id',
  SceneFromSceneItemName = 'Scene returned from scene item with id %VALUE1$ has wrong name',
  SceneFromSceneItemType = 'Scene returned from scene item with id %VALUE1$ has wrong type',
  Visible = 'Failed to set visible attribute of scene item',
  Selected = 'Failed to set selected attribute of scene item',
  PositionX = 'Failed to set position x attribute of scene item',
  PositionY = 'Failed to set position y attribute of scene item',
  Rotation = 'Failed to set rotation attribute of scene item',
  ScaleX = 'Failed to set scale x attribute of scene item',
  ScaleY = 'Failed to set scale y attribute of scene item',
  CropTop = 'Failed to set crop top value',
  CropBottom = 'Failed to set crop bottom value',
  CropLeft = 'Failed to set crop left value',
  CropRight = 'Failed to set crop right value',
  SceneItemId = 'Falied to get scene item id',
  // osn-source
  SourceId = 'Failed to get id of source %VALUE1%',
  SourceName = 'Failed to get name of source %VALUE1%',
  Configurable = 'Failed to get configurable value of source %VALUE1%',
  Properties = 'Failed to get properties values of source %VALUE1%',
  Settings = 'Failed to get settings of source %VALUE1%',
  OutputFlags = 'Failed to get output flags of source %VALUE1%',
  SaveSettings = 'Failed to save settings of source %VALUE1%',
  Flags = 'Failed to update flags of source %VALUE1%',
  FlagsWrongValue = 'Source %VALUE1% has wrong flags value after update',
  SetFlags = 'Failed to set flags of source %VALUE1%',
  Muted = 'Failed to update muted value of source %VALUE1%',
  MutedWrongValue = 'Source %VALUE1% has wrong muted value after update',
  Enabled = 'Failed to get enabled valued of source %VALUE1%',
  EnabledWrongValue = 'Source %VALUE1% has wrong enabled value after update',
  // osn-transition
  CreateTransition = 'Failed to create transition ',
  TransitionId = 'Transition %VALUE1% id value is wrong',
  TransitionName = 'Transition %VALUE1% name value is wrong',
  TransitionSetting = 'Transition %VALUE1% setting is wrong',
  GetActiveSource = 'Failed to get active source from transition %VALUE1%',
  // osn-video
  VideoSkippedFrames = 'Failed to get video skipped frames',
  VideoSkippedFramesWrongValue = 'Returned video skipped frames value is wrong',
  VideoTotalFrames = 'Failed to get video total frames',
  VideoTotalFramesWrongValue = 'Returned video totral frames value is wrong',
  // osn-volmeter
  CreateVolmeter = 'Failed to create volmeter',
  VolmeterCallback = 'Failed to add callback to volmeter',
  RemoveVolmeterCallback = 'Failed to remove callback from volmeter'
}

export function GetErrorMessage(message: string, value1?: string, value2?: string, value3?: string): string {
  let replacements: any;

  if (typeof value1 != 'undefined' &&
      typeof value2 != 'undefined' &&
      typeof value3 != 'undefined') {
      replacements = {"%VALUE1%": value1, "%VALUE2%": value2, "%VALUE3%": value3};
  } else if (typeof value1 != 'undefined' && typeof value2 != 'undefined') {
      replacements = {"%VALUE1%": value1, "%VALUE2%": value2};
  } else if (typeof value1 != 'undefined') {
      replacements = {"%VALUE1%": value1};
  } else {
      return message;
  }

  let errorMessage = message;

  errorMessage = errorMessage.replace(/%\w+%/g, function(all) {
      return replacements[all] || all;
  });

  return errorMessage;
}

export enum TransitionName {
  Cut = 'cut',
  Replay = 'stinger_replay',
  Live = 'stinger_live',
}