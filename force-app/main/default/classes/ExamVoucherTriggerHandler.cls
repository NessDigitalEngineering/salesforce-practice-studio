public without sharing class ExamVoucherTriggerHandler extends TriggerHandler {
  public override void beforeInsert() {
    for (Exam_Voucher__c voucher : (List<Exam_Voucher__c>) Trigger.new) {
      //
    }
  }
}
