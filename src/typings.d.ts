/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
declare var tinymce: any;

// declare var echarts: any;

// declare var window: Window;
interface Window {
  process: any;
  require: any;
}

