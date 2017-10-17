<main class="tab-pane block--container active" ng-if="globalService.currentTab==globalService.tabs.queryOpid.id" ng-controller='queryOpidCtrl' role="main" ng-cloak>

    <!-- Section 1 -->
    <section class="block txstatus__1">
        <article class="row">
            <section class="col-xs-12 col-sm-8 col-sm-offset-2 text-center">
                <h1>根据交易id查询操作id</h1>
            </section>

            <section class="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
                <input
                        class="form-control"
                        type="text"
                        placeholder="0x3f0efedfe0a0cd611f2465fac9a3699f92d6a06613bc3ead4f786856f5c73e9c"
                        ng-model="transactionId"
                        ng-change="changeTransactionId()"
                        ng-class="{true:'is-valid',false:'is-invalid'}[isValid]"/>
                <button tabindex="0"
                        role="button"
                        class="btn btn-primary"
                        ng-click="queryOpId()"> 查询 </button>
            </section>
        </article>
    </section>

    <section class="block txstatus__2" ng-show="opidShow">
        <article class="row">
            <section class="col-xs-6 col-sm-3">
                <div>操作id</div>
            </section>

            <section class="col-xs-6 col-sm-9">
                <div >{{opId}}</div>
            </section>
        </article>
    </section>
    <!-- / Section 1 -->

</main>
