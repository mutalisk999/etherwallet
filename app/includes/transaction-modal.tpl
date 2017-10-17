<article class="modal fade" id="transactionDetail" tabindex="-1">
    <section class="modal-dialog">
        <section class="modal-content">

            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <div class="tx-table" style="width:100%;">
                    <table style="width:100%;">
                        <tbody style="width:100%;">
                        <tr>
                            <td>交易时间</td>
                            <td>{{selectTx.txTime}}</td>
                        </tr>
                        <tr>
                            <td>交易id</td>
                            <td>{{selectTx.txId}}</td>
                        </tr>
                        <tr>
                            <td>操作者地址</td>
                            <td>{{selectTx.from}}</td>
                        </tr>
                        <tr>
                            <td>目标地址</td>
                            <td>{{selectTx.to}}</td>
                        </tr>
                        <tr>
                            <td>交易金额</td>
                            <td>{{selectTx.txAmount}}&nbsp;{{ajaxReq.type}}</td>
                        </tr>
                        <tr>
                            <td>合约id</td>
                            <td>{{selectTx.contractAddress}}</td>
                        </tr>
                        <tr>
                            <td>操作id</td>
                            <td>{{selectTx.opId}}</td>
                        </tr>
                        <tr>
                            <td>操作id确认个数</td>
                            <td>{{selectTx.confirm}}</td>
                        </tr>
                        <tr>
                            <td>交易是否已完成</td>
                            <td>{{selectTx.isFinish}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </section>
</article>

