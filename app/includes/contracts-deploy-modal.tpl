<article class="modal fade" id="deployContract" tabindex="-1">
  <section class="modal-dialog">
    <section class="modal-content">

      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal">&times;</button>

        <h2 class="modal-title text-danger" translate="SENDModal_Title">Warning!</h2>

        <p>����Ҫ��<strong>{{ajaxReq.type}}</strong>����ִ�к�Լ��һ������.</p>

        <p> ������Ϣ��<strong>{{ajaxReq.type}}</strong>�ڵ���<strong>{{ajaxReq.service}}</strong>�ṩ.</p>

        <h4 translate="SENDModal_Content_3"> Are you sure you want to do this? </h4>
      </div>

      <div class="modal-footer">
        <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
          No, get me out of here!
        </button>
        <button class="btn btn-primary" ng-click="sendTx()" translate="SENDModal_Yes">
          Yes, I am sure! Make transaction.
        </button>
      </div>

    </section>
  </section>
</article>
