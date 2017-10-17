'use strict';
var globalService = function($http, $httpParamSerializerJQLike) {
  globalFuncs.checkAndRedirectHTTPS();
  ajaxReq.http = $http;
  ajaxReq.postSerializer = $httpParamSerializerJQLike;
  ajaxReq.getETHvalue = nodes.ethPrice.getETHvalue;
  ajaxReq.getRates = nodes.ethPrice.getRates;
var tabs = {
  generateWallet: {
    id: 0,
    name: "NAV_GenerateWallet_alt",
    url: "generate-wallet",
    mew: true,
    cx: false
  },
  myWallet: {
    id: 1,
    name: "NAV_MyWallets",
    url: "my-wallet",
    mew: false,
    cx: true
  },
  addWallet: {
    id: 2,
    name: "NAV_AddWallet",
    url: "add-wallet",
    mew: false,
    cx: true
  },
  sendTransaction: {
    id: 3,
    name: "NAV_SendEther",
    url: "send-transaction",
    mew: true,
    cx: true
  },
  /*swap: {
    id: 4,
    name: "NAV_Swap",
    url: "swap",
    mew: true,
    cx: true
  },
  offlineTransaction: {
    id: 5,
    name: "NAV_Offline",
    url:"offline-transaction",
    mew: true,
    cx: false
  },*/
    cacheContractAddress: {
    id: 4,
    name: "NAV_CacheContractAddress",
    url:"cache-contract-address",
    mew: true,
    cx: false
 },
    deployContract: {
    id: 5,
    name: "NAV_DeployContract",
    url: "deploy-contract",
    mew: true,
    cx: true
  },
    executeWithContract: {
        id: 6,
        name: "NAV_ExecuteWithContract",
        url: "execute-with-contract",
        mew: true,
        cx: true
  },
    confirmWithContract: {
        id: 7,
        name: "NAV_ConfirmWithContract",
        url: "confirm-with-contract",
        mew: true,
        cx: true
    },
    revokeWithContract: {
        id: 8,
        name: "NAV_RevokeWithContract",
        url: "revoke-with-contract",
        mew: true,
        cx: true
    },
    queryOpid: {
        id: 9,
        name: "NAV_QueryOpid",
        url: "query-opid",
        mew: true,
        cx: true
    },
  txStatus: {
    id: 10,
    name: "NAV_CheckTxStatus",
    url: "check-tx-status",
    mew: true,
    cx: true
  },
  viewWalletInfo: {
    id: 11,
    name: "NAV_ViewWallet",
    url: "view-wallet-info",
    mew: true,
    cx: false
  },
  signMsg: {
    id: 12,
    name: "NAV_SignMsg",
    url: "sign-message",
    mew: false,
    cx: false
  },
  bulkGenerate: {
    id: 13,
    name: "NAV_BulkGenerate",
    url: "bulk-generate",
    mew: false,
    cx: false
  }

};
var currentTab = 0;
if(typeof chrome != 'undefined')
  currentTab = chrome.windows === undefined ? 0 : 3;
return {
  tabs: tabs,
  currentTab: currentTab
};
};
module.exports = globalService;


