import EthJs from 'ethjs';
import BN from 'bn.js';
import { ContractNames, getContractAddress } from '@archanova/contracts';
import { anyToBN } from '@netgum/utils';
import { Api } from './Api';
import { State } from './State';

export class Eth extends EthJs {
  constructor(
    private options: Eth.IOptions,
    api: Api,
    state: State,
  ) {
    super(api.toEthProvider(Eth.EthError));

    state.eth$.next(this.buildState());
  }

  public getNetworkId(): string {
    const { networkId } = this.options;
    return networkId;
  }

  public async getGasPrice(transactionSpeed: Eth.TTransactionSpeed = Eth.TransactionSpeeds.Regular): Promise<BN> {
    let result: BN = await this.gasPrice().catch(() => null);

    if (!result) {
      const { gasPrice } = this.options;
      result = anyToBN(gasPrice);
    }

    if (!result) {
      result = anyToBN('0x2540be400'); // 10 GWEI
    }

    switch (transactionSpeed) {
      case Eth.TransactionSpeeds.Fast:
        result = result.mul(new BN(2));
        break;

      case Eth.TransactionSpeeds.Slow:
        result = result.div(new BN(2));
        break;
    }

    return result;
  }

  public getContractAddress(contractName: ContractNames): string {
    let result: string = null;
    const { networkId, contractAddresses } = this.options;
    if (
      contractAddresses &&
      contractAddresses[contractName]
    ) {
      result = contractAddresses[contractName];
    }

    if (!result) {
      result = getContractAddress(contractName, networkId);
    }

    return result;
  }

  private buildState(): State.IEth {
    const { networkId } = this.options;
    let networkName: string = 'Unknown';

    switch (networkId) {
      case '1':
        networkName = 'Main';
        break;

      case '3':
        networkName = 'Ropsten';
        break;

      case '4':
        networkName = 'Rinkeby';
        break;

      case '42':
        networkName = 'Kovan';
        break;

      case '77':
        networkName = 'Sokol';
        break;

      case '100':
        networkName = 'xDai';
        break;

      default:
        networkName = 'Local';
    }

    return {
      networkId,
      networkName,
    };
  }
}

export namespace Eth {
  export enum TransactionSpeeds {
    Slow = 'slow',
    Regular = 'regular',
    Fast = 'fast',
  }

  export type TTransactionSpeed = TransactionSpeeds | string | BN;

  export interface IOptions {
    networkId: string;
    gasPrice?: string;
    contractAddresses?: { [key: string]: string };
  }

  export class EthError extends Error {
    constructor(public httpError: any = null) {
      super('EthError');
    }
  }
}
