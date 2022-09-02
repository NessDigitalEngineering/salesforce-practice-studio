trigger ExamVoucherTrigger on Exam_Voucher__c(before insert) {
  new ExamVoucherTriggerHandler().run();
}
