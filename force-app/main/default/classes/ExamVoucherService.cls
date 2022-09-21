global with sharing class ExamVoucherService {
    public class ExamVoucherException extends Exception {}
    public static List<Exam_Voucher__c> setVoucherCodeMasked(
      List<Exam_Voucher__c> examVouchers
    ) {
      String regExp = '(?<!^.{0,3}).(?!.{0,3}$)';
      String replacement = '*';
      for (Exam_Voucher__c examVoucher : examVouchers) {
        examVoucher.Voucher_Code_Masked__c = examVoucher.Voucher_Code__c.replaceAll(regExp, replacement);
      }
      return examVouchers;
    }
  
    public static List<Exam_Voucher__c> unsetVoucherCode(
      List<Exam_Voucher__c> examVouchers
    ) {
      for (Exam_Voucher__c examVoucher : examVouchers) {
        examVoucher.Voucher_Code__c = null;
      }
      return examVouchers;
    }
  }