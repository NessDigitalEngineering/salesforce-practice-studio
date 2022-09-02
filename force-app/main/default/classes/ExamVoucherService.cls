global with sharing class ExamVoucherService {
  public class ExamVoucherException extends Exception {}
  public static List<Exam_Voucher__c> setVoucherCodeEncrypted(
    List<Exam_Voucher__c> examVouchers
  ) {
    Practice_Studio_Setting__mdt defaultSetting = getEncryptionConfig();
    for (Exam_Voucher__c examVoucher : examVouchers) {
      Blob encryptedVoucher = Crypto.encrypt(defaultSetting.Algorithm_Name__c, EncodingUtil.base64Decode(defaultSetting.Private_Key__c), Blob.valueOf(defaultSetting.Initialization_Vector__c), Blob.valueOf(examVoucher.Voucher_Code__c));
      String encryptedVoucherString = EncodingUtil.base64Encode(encryptedVoucher);
      examVoucher.Voucher_Code_Encrypted__c = encryptedVoucherString;
    }
    return examVouchers;
  }

  public static List<Exam_Voucher__c> setVoucherCodeMasked(
    List<Exam_Voucher__c> examVouchers
  ) {

    String regExp = '(?<!^.{0,3}).(?!.{0,3}$)';
    String replacement = '*';
    for (Exam_Voucher__c examVoucher : examVouchers) {
      //voucher.Voucher_Code_Masked__c = 'masked'+voucher.Voucher_Code__c;
      examVoucher.Voucher_Code_Masked__c = examVoucher.Voucher_Code__c.replaceAll(regExp, replacement);
    }
    return examVouchers;
  }

  public static List<Exam_Voucher__c> unsetVoucherCode(
    List<Exam_Voucher__c> vouchers
  ) {
    for (Exam_Voucher__c voucher : vouchers) {
      voucher.Voucher_Code__c = null;
    }
    return vouchers;
  }

  private static Practice_Studio_Setting__mdt getEncryptionConfig() {
    Practice_Studio_Setting__mdt[] appSettings = [SELECT MasterLabel, QualifiedApiName, Algorithm_Name__c ,Initialization_Vector__c, Private_Key__c FROM Practice_Studio_Setting__mdt];
    if(appSettings.size() == 0)
    throw new ExamVoucherException('Encryption config not defined');
    return appSettings[0];
  }
}
