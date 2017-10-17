'use strict';
var viewWalletCtrl = function($scope,$sce, walletService) {
    $scope.usdBalance = "loading";
    $scope.gbpBalance = "loading";
    $scope.eurBalance = "loading";
    $scope.btcBalance = "loading";
    $scope.etherBalance = "loading";
    $scope.tokenVisibility = "hidden";
    $scope.pkeyVisible = false;

    walletService.wallet = null;
    walletService.password = '';
    $scope.ajaxReq = ajaxReq;

    $scope.local = new local();
    $scope.showSelected=false;
    $scope.contractInfoShow=false;
    $scope.Validator=Validator;
    $scope.transactionModal = new Modal(document.getElementById('transactionDetail'));
    $scope.confirmModal = new Modal(document.getElementById('confirmMsg'));
    $scope.delTxId=null;

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
                $scope.showSelected=true;
            }
        });
    }

    $scope.contract={};
    $scope.contract.address="";
    $scope.selectedAddress="选择合约";
    $scope.selectExistingAbi = function(index) {
        $scope.selectedAddress = $scope.contractList[index].contractName;
        $scope.addressDrtv.ensAddressField = $scope.contractList[index].contractAddress;
        $scope.contract.address=$scope.contractList[index].contractAddress;
        $scope.dropdownExistingContracts = false;

        $scope.queryContract();
    }

    $scope.getLocalAddress();
    $scope.ownerAddresses=[];
    //查询合约信息
    $scope.queryContract=function(){
        if(!Validator.isValidENSorEtherAddress($scope.addressDrtv.ensAddressField)){
            uiFuncs.notifier.warning("请输入有效的合约地址");
            return;
        }

        $scope.contractInfoShow=true;
        uiFuncs.queryBalance($scope.addressDrtv.ensAddressField,function(data){
            //console.log('查询余额：'+JSON.stringify(data));
            if(!data.isError){
                $scope.contractBalance=etherUnits.toEther(data.data.balance, 'wei');
            }
        });

        var param = {
            from:"0xe8ae759033522e241a10935dc9b99e5687af9e90",
            to:$scope.addressDrtv.ensAddressField,
            data:'0x1398a5f6'
        };
        uiFuncs.getRequired(param,function(data){
           // console.log('最少签名数：'+JSON.stringify(data));
            if(!data.isError){
                $scope.required=parseInt(data.data[0],16);
            }
        });

        $scope.ownerAddresses=[];
        param = {
            from:"0xe8ae759033522e241a10935dc9b99e5687af9e90",
            to:$scope.addressDrtv.ensAddressField,
            data:'0xa0e67e2b'
        };
        uiFuncs.getOwners(param,function(data){
           // console.log('所有拥有者：'+JSON.stringify(data));
            if(!data.isError){
               if(data.data.length>2){
                   for(var i=2;i<data.data.length;i++){
                       $scope.ownerAddresses.push('0x'+data.data[i].substring(24));
                   }
               }
            }
        });
    }

    $scope.$watch('addressDrtv.ensAddressField', function() {
        if(!Validator.isValidENSorEtherAddress($scope.addressDrtv.ensAddressField)){
            $scope.contractInfoShow=false;
        }
    });


    $scope.queryTransaction=function(index){
        $scope.transactionModal.open();
        $scope.selectTx=$scope.transactionList[index];
        //根据交易查询操作id
        uiFuncs.queryOpId($scope.selectTx.txId,function(data){
                if(!data.isError){
                    if(data.data!=null){
                        $scope.opidShow=true;
                        $scope.selectTx.opId='0x'+data.data[0];
                    }

                    var param={
                        'to':$scope.selectTx.contractAddress
                    };
                    if($scope.selectTx.opId.substring(0,2)=='0x'){
                        param.data="0x627a7419"+$scope.selectTx.opId.substring(2);
                    }else{
                        param.data="0x627a7419"+$scope.selectTx.opId;
                    }

                    //查询是否已完成
                    uiFuncs.getConfirmedAllDone({
                        'to':$scope.selectTx.contractAddress,
                        'data':"0x083c5eba"+$scope.selectTx.opId.substring(2)
                    },function(data){
                        if(!data.isError){
                            if(data.data!=null && data.data.length>0){
                                if('0000000000000000000000000000000000000000000000000000000000000000'==data.data[0]){
                                    $scope.selectTx.isFinish='未完成';
                                    //未完成查询确认数
                                    uiFuncs.confirmedOwners(param,function(data){
                                        if(!data.isError){
                                            $scope.confirmAddresses=[];
                                            if(data.data.length>2){
                                                for(var i=2;i<data.data.length;i++){
                                                    $scope.confirmAddresses.push('0x'+data.data[i].substring(24));
                                                }
                                            }
                                            $scope.selectTx.confirm=$scope.confirmAddresses.length;
                                        }
                                    });
                                }else{
                                    $scope.selectTx.isFinish='已完成';
                                    uiFuncs.getRequired({
                                        from:"0xe8ae759033522e241a10935dc9b99e5687af9e90",
                                        to:$scope.selectTx.contractAddress,
                                        data:'0x1398a5f6'
                                    },function(data){
                                        //console.log('最少签名数：'+JSON.stringify(data));
                                        if(!data.isError){
                                            $scope.selectTx.confirm=parseInt(data.data[0],16);
                                        }
                                    });
                                }
                            }else{
                                $scope.selectTx.isFinish='未完成';
                            }
                        }
                    });

                }
            }
        );
    }

    //分页配置
    $scope.count = 0;
    $scope.p_pernum = 10;
    //变量
    $scope.p_current = 1;
    $scope.p_all_page =0;
    $scope.pages = [];

    //查询交易列表
    $scope.local.transactionList({fromChain:$scope.ajaxReq.type},function(data){
            //console.log("交易列表信息："+JSON.stringify(data));
            if(!data.error){
                $scope.transactionList=data.data;

                //初始化第一页
                _get($scope.p_current,$scope.p_pernum,function(){
                });
            }else{
                uiFuncs.notifier.warning(data.msg);
            }
        }
    );
    //获取数据
    var _get = function(page,size,callback){
        if($scope.transactionList == null){
            $scope.count=0;
        }else{
            $scope.count=$scope.transactionList.length;
        }

        //筛选
        var min = (page-1)*size;
        var max = page*size;
        if(max>$scope.count){
            max=$scope.count;
        }
        $scope.list=[];
        for(var i=min;i<max;i++){
            $scope.list.push($scope.transactionList[i]);
        }
        $scope.p_current = page;
        $scope.p_all_page =Math.ceil($scope.count/$scope.p_pernum);
        reloadPno();
        callback($scope.list);
    }
    //单选按钮选中
    $scope.select= function(id){
    }
    //首页
    $scope.p_index = function(){
        $scope.load_page(1);
    }
    $scope.pre_step = function(){
        if($scope.p_current>1){
            $scope.p_current = $scope.p_current-1;
            _get($scope.p_current,$scope.p_pernum,function(){ });
        }
    }
    $scope.next_step = function(){
        if($scope.p_current<$scope.p_all_page){
            $scope.p_current = $scope.p_current+1;
            _get($scope.p_current,$scope.p_pernum,function(){ });
        }
    }
    //尾页
    $scope.p_last = function(){
        $scope.load_page($scope.p_all_page);
    }
    //加载某一页
    $scope.load_page = function(page){
        _get(page,$scope.p_pernum,function(){ });
    };
    //初始化页码
    var reloadPno = function(){
        $scope.pages=calculateIndexes($scope.p_current,$scope.p_all_page,8);
    };

    //分页算法1,9,8
    var calculateIndexes = function (current, length, displayLength) {
        var indexes = [];
        var start = Math.round(current - displayLength / 2);//-4
        var end = Math.round(current + displayLength / 2);//4
        if (start <= 1) {
            start = 1;
            end = start + displayLength - 1;//4
            if (end >= length - 1) {
                end = length - 1;
            }
        }
        if (end >= length - 1) {
            end = length;
            start = end - displayLength + 1;
            if (start <= 1) {
                start = 1;
            }
        }
        if(current<start){
            for (var i = current; i <= end-current; i++) {
                indexes.push(i);
            }
        }
        else if(current>end){
            start = current-end+start;
            for (var i = start; i <= current; i++) {
                indexes.push(i);
            }
        }else{
            for (var i = start; i <= end; i++) {
                indexes.push(i);
            }
        }
        return indexes;
    };

    $scope.confirm=function(){
        $scope.local.delTransaction({txId:$scope.delTxId}, function(data) {
            $scope.local.transactionList({fromChain:$scope.ajaxReq.type},function(data){
                    //console.log("交易列表信息："+JSON.stringify(data));
                    if(!data.error){
                        $scope.transactionList=data.data;

                        //初始化第一页
                        _get($scope.p_current,$scope.p_pernum,function(data){
                            if((data==null || data.length==0)&&$scope.p_current>1){
                                $scope.p_current = $scope.p_current-1;
                                _get($scope.p_current,$scope.p_pernum,function(data){});
                            }
                        });
                    }else{
                        uiFuncs.notifier.warning(data.msg);
                    }
                }
            );
        });
        $scope.confirmModal.close();
    }

    $scope.delTransaction = function(delTxId) {
        $scope.confirmTitle="消息确认";
        $scope.confirmContent='确认删除交易id为"'+delTxId+'"的交易';
        $scope.confirmModal.open();
        $scope.delTxId=delTxId;
    }
};
module.exports = viewWalletCtrl;
