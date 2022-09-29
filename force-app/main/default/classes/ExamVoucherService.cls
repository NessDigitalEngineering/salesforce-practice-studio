/**
 * @author Trinesh Bhargava
 * @date   09/20/2022
 * @description Apex class for Exam Voucher Service
 */


global with sharing class ExamVoucherService {
  public class ExamVoucherException extends Exception {}
  	/*******************************************************************************************************
	 * @description Returns Encrypted Voucher Codes
	 * @param examVouchers data inseretd via UI/Data Loader
	 * @return List of examVouchers
	 */
  public static List<Exam_Voucher__c> encryptVoucherCode(List<Exam_Voucher__c> examVouchers)
  {
    EncryptDecryptService service= EncryptDecryptService.getInstance();
    for(Exam_Voucher__c examVoucher:examVouchers)
    {
         examVoucher.Voucher_Code_Encrypted__c=service.encryptData(examVoucher.Voucher_Code__c); 
    }
      return examVouchers;
  }
   	/*******************************************************************************************************
	 * @description Returns masked Voucher Codes
	 * @param examVouchers data inseretd via UI/Data Loader
	 * @return List of examVouchers
	 */
  public static List<Exam_Voucher__c> maskVoucherCode(
    List<Exam_Voucher__c> examVouchers
  ) {
    String regExp = '(?<!^.{0,3}).(?!.{0,3}$)';
    String replacement = '*';
    for (Exam_Voucher__c examVoucher : examVouchers) {
      examVoucher.Voucher_Code_Masked__c = examVoucher.Voucher_Code__c.replaceAll(regExp, replacement);
    }
    return examVouchers;
  }
 	/*******************************************************************************************************
	 * @description Returns blank Voucher Codes
	 * @param examVouchers data inseretd via UI/Data Loader
	 * @return List of examVouchers
	 */
  public static List<Exam_Voucher__c> unsetVoucherCode(
    List<Exam_Voucher__c> examVouchers
  ) {
    for (Exam_Voucher__c examVoucher : examVouchers) {
      examVoucher.Voucher_Code__c = null;
    }
    return examVouchers;
  }
}