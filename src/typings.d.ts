/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// https://hackernoon.com/import-json-into-typescript-8d465beded79
declare module "*.mob" {
    const value: any;
    export default value;
}

