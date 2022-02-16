const apiUrl = 'https://metaads.team/tornado';

export const environment = {
  production: false,
  tornado_api: `${apiUrl}`,
  near: {
    networkId: 'testnet',
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    contractId: 'contract.metaads.testnet',
    app: 'MetaAds',
    accountId: 'metaads.testnet'
},
  devmode: true
};
