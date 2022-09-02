global with sharing class ExamVoucherService {
  public static List<Exam_Voucher__c> setVoucherCodeEncrypted(
    List<Exam_Voucher__c> vouchers
  ) {
    for (Exam_Voucher__c voucher : vouchers) {
      voucher.Voucher_Code_Encrypted__c = 'secret';
    }
    return vouchers;
  }

  public static List<Exam_Voucher__c> maskVoucherCode(
    List<Exam_Voucher__c> vouchers
  ) {
    for (Exam_Voucher__c voucher : vouchers) {
      voucher.Voucher_Code__c = 'masked';
    }
    return vouchers;
  }
}
