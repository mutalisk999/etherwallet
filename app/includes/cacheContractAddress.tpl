<main class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.cacheContractAddress.id" ng-controller='cacheContractAddressCtrl' ng-cloak>

    <article class="block__wrap gen__1">

        <section class="block__main2 gen__1--inner">
            <br />
            <h1 aria-live="polite"> 新增合约地址</h1>
            <section class="col-sm-12 clearfix">
                <section class="col-sm-6 clearfix">
                    <label>合约地址</label>
                    <div>
                        <input class="form-control"
                               type="text"
                               ng-model="newContractAddress"
                               ng-change="isValidAddress()"
                               ng-class="{true: 'is-valid', false: 'is-invalid'}[addressValid]"/>
                    </div>
                </section>
                <section class="col-sm-6 clearfix">
                    <label>合约名称</label>
                    <div>
                        <input class="form-control"
                               type="text"
                               ng-model="newContractName"
                               ng-class="Validator.isNotEmpty(newContractName) ? 'is-valid' : 'is-invalid'"
                               maxlength="10"/>
                    </div>
                </section>
            </section>
            <a tabindex="0" role="button" class="btn btn-primary"  ng-click="genNewContractAddress()">新增</a>

        </section>

        <section class="block__right">

            <h2>已存在的合约地址:</h2>
            <ul ng-repeat="contract in contractList track by $index">
                <li>
                  <p>
                    <strong>{{contract.contractName}}&nbsp;&nbsp;
                        <a style="color:#0e97c0;" ng-click="delContract(contract.contractName,contract.contractAddress)">删除</a></strong>
                  </p>
                  <p>
                    <span style="word-wrap:break-word;word-break:break-all;">{{contract.contractAddress}}</span>
                  </p>
                </li>
            </ul>
        </section>
    </article>

    <article>
        @@if (site === 'mew' ) { @@include( '../includes/confirm-modal.tpl', { "site": "mew" } ) }
        @@if (site === 'cx'  ) { @@include( '../includes/confirm-modal.tpl', { "site": "cx"  } ) }
    </article>

</main>
