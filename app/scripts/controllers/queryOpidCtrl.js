'use strict';
var queryOpidCtrl = function($scope) {

    $scope.opidShow=false;
    $scope.isValid=false;
    $scope.Validator = Validator;
    $scope.changeTransactionId=function(){
        if (!$scope.Validator.isValidTxHash($scope.transactionId)){
            $scope.opidShow=false;
            $scope.opId='';
            $scope.isValid=false;
        }else{
            $scope.isValid=true;
        }
    }

    $scope.queryOpId=function(){

        if (!$scope.Validator.isValidTxHash($scope.transactionId)){
            $scope.notifier.warning(globalFuncs.errorMsgs[40]);
            return;
        }

        uiFuncs.queryOpId($scope.transactionId,function(data){
                if(!data.isError){
                    if(data.data!=null){
                        $scope.opidShow=true;
                        $scope.opId='0x'+data.data[0];
                    }else{
                        $scope.notifier.warning('无效的交易id');
                    }
                }else{
                    $scope.notifier.warning(data.error);
                }
            }
        );
    }
};
module.exports = queryOpidCtrl;
