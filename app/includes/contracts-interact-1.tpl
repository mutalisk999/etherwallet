
<!-- Address -->
<section class="col-sm-6 clearfix">
  <div class="row">
    <address-field labeltranslated="CONTRACT_Title" var-name="contract.address"></address-field>
  </div>
</section>

<!-- Select Contract Dropdown -->
<section class="col-sm-6 clearfix" ng-show="showSelected">
  <label> 选择合约地址 </label>
  <div class="dropdown">
    <a class="btn btn-default dropdown-toggle" class="dropdown-toggle" ng-click="dropdownExistingContracts = !dropdownExistingContracts">
      <small class="mono">{{selectedAddress}}</small><i class="caret"></i>
    </a>
    <ul class="dropdown-menu dropdown-menu-left" ng-show="dropdownExistingContracts">
      <li ng-repeat="contract in contractList track by $index"><a ng-click="selectExistingAbi($index)"><small class="mono">{{contract.contractName}}:{{contract.contractAddress}}</small></a></li>
    </ul>
  </div>
</section>

<!-- ABI Textarea -->
<section class="col-xs-12 clearfix">
  <label translate="CONTRACT_Json"> ABI / JSON Interface </label>
  <textarea class="form-control" rows="6" ng-class="Validator.isJSON(contract.abi) ? 'is-valid' : 'is-invalid'" ng-model="contract.abi" readonly></textarea>
</section>

<!-- Button -->
<section class="col-xs-12 clearfix">
  <button class="btn btn-primary" ng-click="initContract()" translate="x_Access"> ACCESS </button>
</section>
