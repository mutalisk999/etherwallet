'use strict';
var cacheContractAddressCtrl = function($scope, $sce) {

    $scope.local = new local();
    $scope.bity = new bity();
    $scope.contractAddress = [];
    $scope.contractList = [];
    $scope.Validator = Validator;
    $scope.ajaxReq = ajaxReq;
    $scope.confirmModal = new Modal(document.getElementById('confirmMsg'));
    $scope.delContractAddress=null;

    $scope.contains=function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //读取本地合同文件
    $scope.getLocalAddress = function() {
        $scope.local.contractList({fromChain:$scope.ajaxReq.type}, function(data) {
            $scope.contractList = [];
            $scope.contractAddress = [];
            if(data.code=='200' && data.data!=null){
                for(var i=0;i<data.data.length;i++){
                    $scope.contractAddress.push(data.data[i].contractAddress);
                    $scope.contractList.push(data.data[i]);
                }
            }
        });
    }

    $scope.confirm=function(){
        $scope.local.delContract({contractAddress:$scope.delContractAddress}, function(data) {
            $scope.getLocalAddress();
        });
        $scope.confirmModal.close();
    }

    $scope.isValidAddress = function() {
        if (ethFuncs.validateEtherAddress($scope.newContractAddress)) {
            $scope.addressValid=true;
            return true;
        } else {
            $scope.addressValid=false;
            return false;
        }
    }

    $scope.genNewContractAddress = function() {
        if (!$scope.isValidAddress($scope.newContractAddress)) {
            $scope.notifier.warning("合约地址格式不正确");
        }else if($scope.contains($scope.contractAddress,$scope.newContractAddress)){
            $scope.notifier.warning("合约地址已存在");
        }else if(!$scope.Validator.isNotEmpty($scope.newContractName)){
            $scope.notifier.warning("合约名称不能为空");
        }else{
            $scope.local.addContract(
                {contractAddress:$scope.newContractAddress,
                 contractName:$scope.newContractName,
                 fromChain:$scope.ajaxReq.type
                },
                function(data) {
                if (data.error){
                    $scope.notifier.danger(data.msg);
                }
                else if(data.code=200){
                    $scope.getLocalAddress();
                    $scope.notifier.info("新增成功");
                }
            });
        }
    }

    $scope.delContract = function(contractName,contractAddress) {
        $scope.confirmTitle="消息确认";
        $scope.confirmContent='确认删除名称为"'+contractName+'"的合约';
        $scope.confirmModal.open();
        $scope.delContractAddress=contractAddress;
    }

   $scope.getLocalAddress();
};
module.exports = cacheContractAddressCtrl;
