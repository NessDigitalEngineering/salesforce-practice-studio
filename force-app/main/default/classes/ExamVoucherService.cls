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

  /*******************************************************************************************************
      * @description This method retrieves all vouchers Admin have
      * @return List of Exam Vouchers
      */
      public List<Exam_Voucher__c> getAvailableExamVouchers(string credType, integer credentialCost) {
        try {
            return [
                SELECT id,Credential_Exam_Attempt__c, Credential_Type__c, Name, Cost__c, Value__c, Sponsor__c, Expiry_Date__c, Status__c FROM Exam_Voucher__c WHERE Status__c='Available' AND ((Credential_Type__c=:credType) AND  (Value__c >=: credentialCost))   WITH SECURITY_ENFORCED ORDER BY Expiry_Date__c, Value__c ASC];
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*******************************************************************************************************
      * @description This method updates exam attempt status
      * @param userId SF id of user
      * @return Update Exam Status
      */
      public Database.SaveResult updateVoucherStatus(String voucherId, String voucherStatus, String examAttemptId){
        try {
          Exam_Voucher__c voucherAssignment = new Exam_Voucher__c();
            voucherAssignment.Id = voucherId;
            voucherAssignment.Status__c = voucherStatus;
            voucherAssignment.Credential_Exam_Attempt__c = examAttemptId;
            return Database.update(voucherAssignment, true);
        } catch (Exception ex) {
            throw ex;
        }
     }

}