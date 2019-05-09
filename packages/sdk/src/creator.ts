import { EnvironmentNames, getEnvironment } from './environments';
import { Environment } from './modules';
import { Sdk } from './Sdk';

/**
 * creates sdk
 * @param env
 */
export function createSdk(env: EnvironmentNames | Environment): Sdk {
  let environment: Environment = null;
  if (env instanceof Environment) {
    environment = env;
  } else {
    environment = getEnvironment(env);
  }

  return new Sdk(environment);
}
