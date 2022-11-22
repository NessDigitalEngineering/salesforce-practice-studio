trigger ExamVoucherTrigger on Exam_Voucher__c (before insert,after update) 
{
  new ExamVoucherTriggerHandler().run();
}