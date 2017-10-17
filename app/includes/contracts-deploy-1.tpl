<section class="col-xs-12">

  <!-- Byte Code -->
  <div class="form-group">
    <h4 translate="CONTRACT_ByteCode"> Byte Code: </h4>
    <textarea readonly
      class="form-control"
      rows="8"
      ng-model="tx.data"
      ng-class="Validator.isValidHex(tx.data)&&tx.data!='' ? 'is-valid' : 'is-invalid'"></textarea>
  </div>

  <!-- Gas -->
  <div class="form-group">
    <h4 translate="TRANS_gas"> Gas: </h4>
    <input class="form-control"
           type="text"
           placeholder="300000"
           ng-model="tx.gasLimit"
           ng-class="Validator.isPositiveNumber(tx.gasLimit) ? 'is-valid' : 'is-invalid'"/>
  </div>

  <div class="form-group">
    <h4> 所有者: </h4>
    <input class="form-control"
           type="text"
           placeholder="多个以,(英文逗号)分隔,例：0xe8ae759033522e241a10935dc9b99e5687af9e90,0xe42e3609d4e6d4db8d79d4c8518670335a86f3fb"
           ng-model="tx.owners"
           ng-class="Validator.isValidAddressArray(tx.owners) ? 'is-valid' : 'is-invalid'"/>
  </div>

  <div class="form-group">
    <h4>最小签名者数: </h4>
    <input class="form-control"
           type="number"
           ng-model="tx.required"
           ng-class="Validator.isPositiveNumber(tx.required) ? 'is-valid' : 'is-invalid'"/>
  </div>

  <!-- Sign TX Button (once wallet has been unlocked) -->
  <div class="form-group">
    <a class="btn btn-info btn-block" ng-click="generateTx()" ng-show="wd" translate="DEP_signtx"> Sign Transaction </a>
  </div>

  <!-- TXs -->
  <section class="row" ng-show="showRaw">
    <!-- Raw TX -->
    <div class="form-group col-sm-6">
      <h4 translate="SEND_raw"> Raw Transaction </h4>
      <textarea class="form-control" rows="4" readonly>{{rawTx}}</textarea>
    </div>
    <!-- Singed TX -->
    <div class="form-group col-sm-6">
      <h4 translate="SEND_signed"> Signed Transaction </h4>
      <textarea class="form-control" rows="4" readonly>{{signedTx}}</textarea>
    </div>
  </section>

  <!-- Deploy Contract Button (once tx has been signed) -->
  <div class="form-group" ng-show="showRaw">
    <a class="btn btn-primary btn-block" data-toggle="modal" data-target="#deployContract" translate="NAV_DeployContract"> Deploy Contract </a>
  </div>

  @@if (site === 'mew' ) { @@include( '../includes/contracts-deploy-modal.tpl', { "site": "mew" } ) }
  @@if (site === 'cx'  ) { @@include( '../includes/contracts-deploy-modal.tpl', { "site": "cx"  } ) }

</section>
