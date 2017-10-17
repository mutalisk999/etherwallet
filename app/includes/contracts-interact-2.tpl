<!-- STEP READ/WRITE -->
<section class="col-xs-12 clearfix">

  <!-- Contract Info CONTRACT_Interact_CTA -->
  <span class="form-group">
    <h4 translate="CONTRACT_Interact_Title">Read / Write Contract </h4>
    <h5> {{ contract.address }} </h5>

    <div class="form-group well" ng-show="contract.address=='0x0101010101010101010101010101010101010101' || contract.address=='0x1010101010101010101010101010101010101010'">
      <p> Please change the address to your Multisig Address to your own address.</p>
    </div>

   <div class="form-group well" ng-show="contract.address=='0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf'">
        <li><strong>Generate EOS Key-pair</strong></li>
        <li><strong>Register / Map your EOS Key</strong>
          <ul>
            <li>Select <code>register</code></li>
            <li> Enter your <strong><u>EOS Public Key</u></strong> <-&#45;&#45; CAREFUL! EOS PUBLIC KEY!</li>
            <li>Unlock wallet</li>
            <li><span translate="SEND_amount">Amount to Send</span>: <code>0</code> &middot; <span translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
        <li><strong>Fund EOS Contract on Send Page</strong>
          <ul>
            <li>Go to Send Ether & Tokens Page</li>
            <li>Unlock same wallet you are unlocking here.</li>
            <li>Send Amount you want to Contribute to <code>0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf</code></li>
            <li><span translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
        <li><strong>Claim EOS Tokens</strong>
          <ul>
            <li>Select <code>claimAll</code>.</li>
            <li>Unlock wallet</li>
            <li><span translate="SEND_amount">Amount to Send</span>: <code>0</code> &middot; <span translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
    </div>

    <div class="btn-group">
      <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
      {{contract.selectedFunc==null ? "Select a function" : contract.selectedFunc.name}}</a>
    </div>
    <br/>
    <div class="btn-group" ng-show="confirmShow">
      <a class="btn btn-default" ng-click="dropdownOpIds = !dropdownOpIds">
      {{selectOpId}}<i class="caret"></i></a>
      <ul class="dropdown-menu" ng-show="dropdownOpIds">
        <li ng-repeat="opId in opIds track by $index"><a ng-click="selectbyOpId($index)">{{opId}}</a></li>
      </ul>
    </div>

    <!--<div class="btn-group" ng-show="confirmShow">
      <a class="btn btn-default" ng-click="confirmedOwners()">
      根据操作id查询已确认地址<i class="caret"></i></a>
      <ul class="dropdown-menu" ng-show="dropdownAddress">
        <li ng-repeat="confirmAddress in confirmAddresses track by $index">{{confirmAddress}}</li>
      </ul>
    </div>-->
  </span>

  <!-- Write -->
  <span class="form-group" ng-show="contract.selectedFunc!=null">
    <div ng-repeat="input in contract.functions[contract.selectedFunc.index].inputs track by $index">

        <div ng-switch on="input.type">
          <div class="item write-address" ng-switch-when="address">
          <label> {{input.desc}} </label>
          <div class="row">
            <div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..." ng-model="input.value" ng-class="Validator.isValidAddress(input.value) ? 'is-valid' : 'is-invalid'"/></div>
            <div class="col-xs-1"><div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{input.value}}" watch-var="input.value" ></div></div>
          </div>
          </div>
          <p class="item write-unit256" ng-switch-when="uint256">
            <label> {{input.desc}}  </label>
            <input class="form-control" type="text" placeholder="151" ng-model="input.value" ng-class="Validator.isPositiveNumber(input.value) ? 'is-valid' : 'is-invalid'"/>
          </p>
          <p class="item write-string" ng-switch-when="string">
            <label>{{input.desc}} </label>
            <input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="input.value" ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
          </p>
          <p class="item write-bytes" ng-switch-when="bytes">
            <label> {{input.desc}} </label>
            <input class="form-control" type="text" placeholder="0x151bc..." ng-model="input.value" ng-class="Validator.isValidHex(input.value) ? 'is-valid' : 'is-invalid'"/>
          </p>
          <p class="item write-boolean" ng-switch-when="bool">
            <label> {{input.desc}} </label>
            <span class="radio"><label><input ng-model="input.value" type="radio" name="optradio-{{input.name}}" ng-value="true">True</label></span>
            <span class="radio"><label><input ng-model="input.value" type="radio" name="optradio-{{input.name}}" ng-value="false">False</label></span>
          </p>
          <p class="item" ng-switch-default>
            <label> {{input.desc}}  </label>
            <input class="form-control" type="text" placeholder="" ng-model="input.value" ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
          </p>
      </div>
    </div>

     <div class="form-group" ng-show="confirmShow">
      <button class="btn btn-primary" ng-click="confirmedOwners()">根据操作id查询已确认地址</button>
      <ul class="opid-ul">
        <li ng-repeat="confirmAddress in confirmAddresses track by $index">{{confirmAddress}}</li>
      </ul>
    </div>
  </span>
  <!-- / Write -->


  <!-- Output -->
  <span class="form-group output" ng-show="contract.functions[contract.selectedFunc.index].constant">
    <div ng-repeat="output in contract.functions[contract.selectedFunc.index].outputs track by $index" class="form-group">
      <div ng-switch on="output.type">
        <!-- Address -->
        <div class="item write-address" ng-switch-when="address">
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <div class="row">
            <div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..." ng-model="output.value" readonly/></div>
            <div class="col-xs-1"><div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{output.value}}" watch-var="output.value" > </div> </div>
          </div>
        </div>
        <!-- unit256 -->
        <p class="item write-unit256" ng-switch-when="uint256">
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <input class="form-control" type="text" placeholder="151" ng-model="output.value" readonly/>
        </p>
        <!-- Address -->
        <p class="item write-string" ng-switch-when="string">
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="output.value" readonly/>
        </p>
        <!-- Bytes -->
        <p class="item write-bytes" ng-switch-when="bytes">
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <input class="form-control" type="text" placeholder="请输入0x开头，0~9或者a~f结尾的一个或多个字符，例如:0x151bc" ng-model="output.value" readonly/>
        </p>
        <!-- Boolean -->
        <p class="item write-boolean" ng-switch-when="bool">
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <span ng-show="output.value==true" class="output-boolean-true"> <img src="images/icon-check-green.svg" width="22px" height="22px" /> TRUE </span>
          <span ng-show="output.value==false" class="output-boolean-false"> <img src="images/icon-x.svg" width="22px" height="22px" />  FALSE </span>
        </p>
        <!--  -->
        <p class="item" ng-switch-default>
          <label> &#8627; {{output.name}} <small> {{output.type}} </small> </label>
          <input class="form-control" type="text" placeholder="" ng-model="output.value" readonly/>
        </p>
      </div>
    </div>

  </span>
  <!-- / Output -->


</section>
