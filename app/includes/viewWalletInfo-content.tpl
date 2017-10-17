
<article class="col-sm-12">
<article class="col-sm-12 view-wallet-content block">

  <section class="col-sm-12">
      <div class="account-help-icon">
        <img src="images/icon-help.svg" class="help-icon" />
        <h5>查询多签钱包合约信息</h5>
      </div>
  </section>

  <section class="col-sm-12">
  <section class="col-sm-6 clearfix">
    <div class="row">
      <address-field labeltranslated="CONTRACT_Title" var-name="contract.address"></address-field>
    </div>
  </section>

  <!-- Select Contract Dropdown -->
  <section class="col-sm-5 clearfix" ng-show="showSelected">
    <label> 选择多签钱包合约地址 </label>
    <div class="dropdown">
      <a class="btn btn-default dropdown-toggle" class="dropdown-toggle" ng-click="dropdownExistingContracts = !dropdownExistingContracts">
        <small class="mono">{{selectedAddress}}</small><i class="caret"></i>
      </a>
      <ul class="dropdown-menu dropdown-menu-left" ng-show="dropdownExistingContracts">
        <li ng-repeat="contract in contractList track by $index"><a ng-click="selectExistingAbi($index)"><small class="mono">{{contract.contractName}}:{{contract.contractAddress}}</small></a></li>
      </ul>
    </div>
  </section>
  <section class="col-sm-1 clearfix" style="bottom:-20px;">
    <button tabindex="0"
            role="button"
            class="btn btn-primary"
            ng-click="queryContract()">查询</button>
  </section>
  </section>

  <section class="col-sm-12" ng-show="contractInfoShow">
    <article class="row">
      <section class="col-xs-6 col-sm-3">
        <label style="visibility:hidden">0</label>
        <div>多签钱包合约地址</div>
      </section>

      <section class="col-xs-6 col-sm-9">
        <label style="visibility:hidden">0</label>
        <div >{{addressDrtv.ensAddressField}}</div>
      </section>
    </article>

    <article class="row">
      <section class="col-xs-6 col-sm-3">
        <label style="visibility:hidden">0</label>
        <div>最小签名数</div>
      </section>

      <section class="col-xs-6 col-sm-9">
        <label style="visibility:hidden">0</label>
        <div >{{required}}</div>
      </section>
    </article>

    <article class="row">
      <section class="col-xs-6 col-sm-3">
        <label style="visibility:hidden">0</label>
        <div>合约余额</div>
      </section>

      <section class="col-xs-6 col-sm-9">
        <label style="visibility:hidden">0</label>
        <div >{{contractBalance}}</div>
      </section>
    </article>

      <article class="row">
        <section class="col-xs-6 col-sm-3">
          <label style="visibility:hidden">0</label>
          <div>所有者地址</div>
        </section>

        <section class="col-xs-6 col-sm-9">
          <label style="visibility:hidden">0</label>
          <div ng-repeat="ownerAddress in ownerAddresses">{{ownerAddress}}</div>
        </section>
    </article>
  </section>

</article>

  <article class="col-sm-12 view-wallet-content block">
    <section class="col-sm-12">
      <div class="account-help-icon">
        <img src="images/icon-help.svg" class="help-icon" />
        <h5>查询多签钱包合约交易信息</h5>
      </div>
    </section>
    <section class="col-sm-12 tx-table">
      <table style="width:100%;">
        <thead style="width:100%;">
        <tr style="width:100%;">
          <th style="width:20%;">
            交易时间
          </th>
          <th style="width:60%;">
            交易id
          </th>
          <th style="width:10%;">
            交易金额
          </th>
          <th style="width:10%;">
            操作
          </th>
        </tr>
        </thead>
        <tbody style="width:100%;">
        <tr ng-repeat="transaction in list">
          <td>{{transaction.txTime}}</td>
          <td>{{transaction.txId}}</td>
          <td>{{transaction.txAmount}}&nbsp;{{transaction.fromChain}}</td>
          <td><a ng-click="queryTransaction($index)">详情</a>&nbsp;&nbsp;&nbsp;<a ng-click="delTransaction(transaction.txId)">删除</a></td>
        </tr>
        </tbody>
      </table>
      <ul class="pagination" style="margin: 0px;" >
        <li><a  ng-class="{true:'disabled'}[p_current==1]" href="javascript:void(0);" ng-click="p_index()">首页</a></li>
        <li><a  ng-class="{true:'disabled'}[p_current==1]" href="javascript:void(0);" ng-click="pre_step()">上一页</a></li>
        <li ng-repeat="page in pages"><a ng-class="{true:'selected',false:'unselected'}[p_current==page]" href="javascript:void(0);" ng-click="load_page(page)">
          {{ page }}</a></li>
        <li><a ng-class="{true:'disabled'}[p_current==p_all_page]" href="javascript:void(0);" ng-click="next_step()">下一页</a></li>
        <li><a ng-class="{true:'disabled'}[p_current==p_all_page]" href="javascript:void(0);" ng-click="p_last()">尾页</a></li>
      </ul>
      <span style="vertical-align: 12px;"> &nbsp;&nbsp;共：{{count}} 条</span>
    </section>
  </article>

</article>


<!--<article class="col-sm-4">
  <wallet-balance-drtv></wallet-balance-drtv>
</article>-->
