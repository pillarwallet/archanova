import { createLocalSdkEnvironment, SdkEnvironmentNames, getSdkEnvironment, Sdk, sdkModules, createSdk } from '@archanova/sdk';
import Ws from 'ws';
import { StorageAdapter } from './StorageAdapter';

export function configureSdk(options: {
  env: string,
  localEnv: {
    host: string;
  };
  storage: {
    rootPath: string;
  }
}): Sdk {
  let sdkEnv: sdkModules.Environment = createLocalSdkEnvironment(options.localEnv.host);

  switch (options.env) {
    case 'kovan':
      sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Kovan);
      break;

    case 'rinkeby':
      sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Rinkeby);
      break;
  }

  const storageAdapter: sdkModules.Storage.IAdapter = options.storage
    ? new StorageAdapter(
      options.storage.rootPath,
    )
    : null;

  return createSdk(
    sdkEnv
      .setConfig('storageAdapter', storageAdapter)
      .setConfig('apiWebSocketConstructor', Ws),
  );
}