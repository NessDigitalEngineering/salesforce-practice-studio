/**
 * @author Dipshika Nalawade
 * @date   16/09/2022
 * @description Service Class containing methods specific to Voucher Assignment
 */

public with sharing class voucherAssignmentService {
    /*******************************************************************************************************
      * @description This method retrieves voucher Approved  user
      * @param userId SF id of user
      * @return List of Credential Exam Attempt
      */
      public List<Credential_Exam_Attempt__c> getVoucherAssignedUser(String userId) {
        try {
           userInfo.getUserId();
            return [
               SELECT id, Credential__c, Name, Status__c, User__c, CreatedById FROM Credential_Exam_Attempt__c WHERE User_Credential__r.User__c =:userId AND ((Credential_Exam_Attempt__c.Status__c != 'Voucher Approved')) WITH SECURITY_ENFORCED];
        } catch (Exception ex) {
            throw ex;
        }
    }
}
