<article class="modal fade" id="confirmMsg" tabindex="-1">
    <section class="modal-dialog">
        <section class="modal-content">

            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 ng-bind="confirmTitle" style="text-align:center"></h4>
                <div ng-bind="confirmContent" style="text-align:center"></div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" ng-click="confirm()">
                    确认
                </button>

                <button class="btn btn-default" data-dismiss="modal">
                    取消
                </button>
            </div>
        </section>
    </section>
</article>

