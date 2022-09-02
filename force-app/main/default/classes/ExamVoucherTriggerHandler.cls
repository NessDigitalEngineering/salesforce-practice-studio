public without sharing class ExamVoucherTriggerHandler extends TriggerHandler {
  public override void beforeInsert() {
    ExamVoucherService.setVoucherCodeEncrypted((List<Exam_Voucher__c>) Trigger.new);
    ExamVoucherService.setVoucherCodeMasked((List<Exam_Voucher__c>) Trigger.new);
    ExamVoucherService.unsetVoucherCode((List<Exam_Voucher__c>) Trigger.new);
    ExamVoucherService.decryptVoucherCode((List<Exam_Voucher__c>) Trigger.new);
  }
}
