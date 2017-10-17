'use strict';
var revokeWithContract = function($scope, $sce, walletService) {
    $scope.ajaxReq = ajaxReq;
    $scope.local = new local();
    walletService.wallet = null;
    $scope.visibility = "interactView";
    $scope.sendContractModal = new Modal(document.getElementById('sendContract'));
    $scope.showReadWrite = false;
    $scope.sendTxModal = new Modal(document.getElementById('deployContract'));
    $scope.Validator = Validator;
    $scope.confirmShow=true;
    $scope.revokeFuncId=0;
    $scope.tx = {
        gasLimit: '',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        nonce: null,
        gasPrice: null
    }
    $scope.contract = {
        address: globalFuncs.urlGet('address') != null && $scope.Validator.isValidAddress(globalFuncs.urlGet('address')) ? globalFuncs.urlGet('address') : '',
        abi: '',
        functions: [],
        selectedFunc: null
    }
    //$scope.selectedAbi = ajaxReq.abiList[0];
    $scope.contains=function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    $scope.contractList=[];
    $scope.getLocalAddress = function() {
        $scope.local.contractList({fromChain:$scope.ajaxReq.type}, function(data) {
            $scope.contractList = [];
            if(data.code=='200' && data.data!=null) {
                for (var i = 0; i < data.data.length; i++) {
                    $scope.contractList.push(data.data[i]);
                }
            }
            if($scope.contractList.length>0){
                $scope.selectedAddress=$scope.contractList[0].contractName;
                $scope.contract.address=$scope.contractList[0].contractAddress;
                $scope.addressDrtv.ensAddressField=$scope.contractList[0].contractAddress;
                $scope.showSelected=true;
            }
        });
    }

    $scope.getLocalAddress();

    $scope.showRaw = false;
    $scope.$watch(function() {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function() {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;
        $scope.tx.nonce = 0;

    });
    $scope.$watch('visibility', function(newValue, oldValue) {
        $scope.tx = {
            gasLimit: '',
            data: '',
            to: '',
            unit: "ether",
            value: 0,
            nonce: null,
            gasPrice: null
        }

    });
    $scope.$watch('tx', function(newValue, oldValue) {
        $scope.showRaw = false;
        if (newValue.gasLimit == oldValue.gasLimit && $scope.Validator.isValidHex($scope.tx.data) && $scope.tx.data != '' && $scope.Validator.isPositiveNumber($scope.tx.value)) {
            if ($scope.estimateTimer) clearTimeout($scope.estimateTimer);
            $scope.estimateTimer = setTimeout(function() {
                $scope.estimateGasLimit();
            }, 50);
        }
    }, true);

    $scope.selectExistingAbi = function(index) {
        $scope.selectedAddress = $scope.contractList[index].contractName;
        $scope.contract.address = $scope.contractList[index].contractAddress;
        $scope.addressDrtv.ensAddressField = $scope.contractList[index].contractAddress;
        $scope.addressDrtv.showDerivedAddress = false;
        $scope.dropdownExistingContracts = false;
        $scope.contract.selectedFunc=null;
        $scope.dropdownContracts = false;

        if ($scope.initContractTimer) clearTimeout($scope.initContractTimer);
        $scope.initContractTimer = setTimeout(function() {
            $scope.initContract();
        }, 50);
    }
    $scope.estimateGasLimit = function() {
        var estObj = {
            from: $scope.wallet != null ? $scope.wallet.getAddressString() : globalFuncs.donateAddress,
            value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei($scope.tx.value, $scope.tx.unit))),
            data: ethFuncs.sanitizeHex($scope.tx.data),
        }
        if ($scope.tx.to != '') estObj.to = $scope.tx.to;
        ethFuncs.estimateGas(estObj, function(data) {
            if (!data.error) $scope.tx.gasLimit = data.data;
        });
    }
    $scope.generateTx = function() {
        try {
            if ($scope.wallet == null) throw globalFuncs.errorMsgs[3];
            else if (!ethFuncs.validateHexString($scope.tx.data)) throw globalFuncs.errorMsgs[9];
            else if (!globalFuncs.isNumeric($scope.tx.gasLimit) || parseFloat($scope.tx.gasLimit) <= 0) throw globalFuncs.errorMsgs[8];
            $scope.tx.data = ethFuncs.sanitizeHex($scope.tx.data);
            ajaxReq.getTransactionData($scope.wallet.getAddressString(), function(data) {
                if (data.error) $scope.notifier.danger(data.msg);
                data = data.data;
                $scope.tx.to = $scope.tx.to == '' ? '0xCONTRACT' : $scope.tx.to;
                $scope.tx.contractAddr = $scope.tx.to == '0xCONTRACT' ? ethFuncs.getDeteministicContractAddress($scope.wallet.getAddressString(), data.nonce) : '';
                var txData = uiFuncs.getTxData($scope);
                uiFuncs.generateTx(txData, function(rawTx) {
                    if (!rawTx.isError) {
                        $scope.rawTx = rawTx.rawTx;
                        $scope.signedTx = rawTx.signedTx;

                        $scope.showRaw = true;
                    } else {
                        $scope.showRaw = false;
                        $scope.notifier.danger(rawTx.error);
                    }
                    if (!$scope.$$phase) $scope.$apply();
                });
            });
        } catch (e) {
            $scope.notifier.danger(e);
        }
    }
    $scope.sendTx = function() {
        $scope.sendTxModal.close();
        $scope.sendContractModal.close();
        uiFuncs.sendTx($scope.signedTx, function(resp) {
            if (!resp.isError) {
                var bExStr = $scope.ajaxReq.type != nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr != '' ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {
                $scope.notifier.danger(resp.error);
            }
        });
    }
    $scope.setVisibility = function(str) {
        $scope.visibility = str;
    }
    $scope.selectFunc = function() {
        var index=0;
        for(var i=0;i<$scope.contract.functions.length;i++){
            if($scope.contract.functions[i].name=='revoke'){
                $scope.contract.selectedFunc = { name: $scope.contract.functions[i].name, index: i };
                index=i;
                $scope.revokeFuncId=i;
                break;
            }
        }

        for(var j=0;j<$scope.contract.functions[index].inputs.length;j++){
            if($scope.contract.functions[index].inputs[j].type=='bytes32'){
                $scope.contract.functions[index].inputs[j].desc='操作id';
            }
        }
        //console.log($scope.contract.functions[index].inputs);
        // $scope.contract.selectedFunc = { name: $scope.contract.functions[index].name, index: index };
        if (!$scope.contract.functions[index].inputs.length) {
            $scope.readFromContract();
            $scope.showRead = false;
        } else {
            $scope.showRead = true;
        }
        $scope.dropdownContracts = !$scope.dropdownContracts;
    }

    $scope.getTxData = function() {
        var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        var types = typeName.split(',');
        types = types[0] == "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                else values.push(curFunc.inputs[i].value);
            } else values.push('');
        }
        return '0x' + funcSig + ethUtil.solidityCoder.encodeParams(types, values);
    }
    $scope.readFromContract = function() {
        ajaxReq.getEthCall({ to: $scope.contract.address, data: $scope.getTxData() }, function(data) {
            if (!data.error) {
                var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
                var outTypes = curFunc.outputs.map(function(i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''));
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber) curFunc.outputs[i].value = decoded[i].toFixed(0);
                    else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;

        });
    }

    //查询操作id
    $scope.queryOpId=function(){
        uiFuncs.getOpIds({'to':$scope.contract.address},function(data){
                //console.log("未完成确认的操作的id："+JSON.stringify(data));
                if(!data.isError){
                    $scope.opIds=[];
                    if(data.data.length>2){
                        for(var i=2;i<data.data.length;i++){
                            $scope.opIds.push('0x'+data.data[i]);
                        }
                    }
                }else{
                    $scope.notifier.warning(data.error);
                }
            }
        );
    }

    $scope.dropdownAddress=false;
    $scope.confirmedOwners=function(){
        if($scope.dropdownAddress){
            $scope.dropdownAddress=false;
            return;
        }
        //操作id
        var opid = $scope.contract.functions[$scope.revokeFuncId].inputs[0].value;
        if(opid==null || opid=='' || opid.length<64){
            $scope.notifier.warning("请先填写操作id");
            return;
        }

        var param={
            'to':$scope.contract.address
        };
        if(opid.substring(0,2)=='0x'){
            param.data="0x627a7419"+opid.substring(2);
        }else{
            param.data="0x627a7419"+opid;
        }

        uiFuncs.confirmedOwners(param,function(data){
            if(!data.isError){
                $scope.confirmAddresses=[];
                if(data.data.length>2){
                    for(var i=2;i<data.data.length;i++){
                        $scope.confirmAddresses.push('0x'+data.data[i].substring(24));
                        //打开下拉菜单
                        $scope.dropdownAddress=true;
                    }
                }
            }else{
                $scope.notifier.warning(data.error);
            }
        });
    }

    $scope.initContract = function() {
        try {
            if (!$scope.Validator.isValidAddress($scope.contract.address)) throw globalFuncs.errorMsgs[5];
            else if (!$scope.Validator.isJSON($scope.contract.abi)) throw globalFuncs.errorMsgs[26];
            $scope.contract.functions = [];
            var tAbi = JSON.parse($scope.contract.abi);
            for (var i in tAbi)
                if (tAbi[i].type == "function") {
                    tAbi[i].inputs.map(function(i) { i.value = ''; });
                    $scope.contract.functions.push(tAbi[i]);
                }
            $scope.showReadWrite = true;
            $scope.selectFunc();
            $scope.queryOpId();
        } catch (e) {
            $scope.notifier.danger(e);
        }
    }

    $scope.contract.abi='[{"constant":true,"inputs":[],"name":"getOpIds","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_operation","type":"bytes32"}],"name":"ConfirmedAllDone","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRequired","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"m_numOwners","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_operation","type":"bytes32"}],"name":"ConfirmedOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"m_required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_h","type":"bytes32"}],"name":"confirm","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"execute","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operation","type":"bytes32"}],"name":"revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_operation","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"hasConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ownerIndex","type":"uint256"}],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwnerCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"data","type":"bytes"}],"name":"MultiTransact","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"operation","type":"bytes32"},{"indexed":false,"name":"initiator","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"data","type":"bytes"}],"name":"ConfirmationNeeded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"}],"name":"Revoke","type":"event"}]';
    $scope.ownerAddresses=[];
    $scope.generateContractTx = function() {
        if (!$scope.wd) {
            $scope.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }

        var param = {
            from:$scope.wallet.getAddressString(),
            to:$scope.addressDrtv.ensAddressField,
            data:'0xa0e67e2b'
        };
        uiFuncs.getOwners(param,function(data){
            //console.log('所有拥有者：'+JSON.stringify(data));
            $scope.ownerAddresses=[];
            if(!data.isError){
                if(data.data.length>2){
                    for(var i=2;i<data.data.length;i++){
                        $scope.ownerAddresses.push('0x'+data.data[i].substring(24));
                    }
                }
            }

            if(!$scope.contains($scope.ownerAddresses,$scope.wallet.getAddressString())){
                //console.log('所有拥有者：'+JSON.stringify($scope.ownerAddresses));
                $scope.notifier.danger("用户没有权限进行合约转账");
                return;
            }

            //判断是否确认过
            var param={
                'to':$scope.contract.address
            };
            var opid = $scope.contract.functions[$scope.revokeFuncId].inputs[0].value;
            if(opid==null || opid=='' || opid.length<64){
                $scope.notifier.warning("请先填写操作id");
                return;
            }
            if(opid.substring(0,2)=='0x'){
                param.data="0x627a7419"+opid.substring(2);
            }else{
                param.data="0x627a7419"+opid;
            }

            uiFuncs.confirmedOwners(param,function(data){
                if(!data.isError){
                    $scope.confirmAddressArray=[];
                    if(data.data.length>2){
                        for(var i=2;i<data.data.length;i++){
                            $scope.confirmAddressArray.push('0x'+data.data[i].substring(24));
                        }
                    }
                    //判断是否已经确认过了
                    if(!$scope.contains($scope.confirmAddressArray,$scope.wallet.getAddressString())){
                        $scope.notifier.warning("用户未确认过该交易");
                        return;
                    }
                }else{
                    $scope.notifier.warning(data.error);
                }

                $scope.tx.data = $scope.getTxData();
                $scope.tx.to = $scope.contract.address;
                $scope.sendContractModal.open();
            });
        });
    }

    //选择操作Id
    $scope.selectOpId='选择操作id';
    // $scope.opIds=['0xe8ae759033522e241a10935dc9b99e5687af9e90','0xe8ae759033522e241a10935dc9b99e5687af9e91'];
    $scope.selectbyOpId = function(index){
        $scope.dropdownOpIds=false;
        $scope.selectOpId=$scope.opIds[index];

        var num=0;
        for(var i=0;i<$scope.contract.functions.length;i++){
            if($scope.contract.functions[i].name=='revoke'){
                $scope.contract.selectedFunc = { name: $scope.contract.functions[i].name, index: i };
                num=i;
                break;
            }
        }
        for(var j=0;j<$scope.contract.functions[num].inputs.length;j++){
            if($scope.contract.functions[num].inputs[j].type=='bytes32'){
                $scope.contract.functions[num].inputs[j].desc='操作id';
                $scope.contract.functions[num].inputs[j].value=$scope.opIds[index];
            }
        }
    }
}
module.exports = revokeWithContract;
