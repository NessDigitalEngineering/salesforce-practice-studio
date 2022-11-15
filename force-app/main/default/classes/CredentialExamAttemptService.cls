/**
 * @author Dipshika Nalawade
 * @date   04/08/2022
 * @description Service Class containing methods specific to Credential Exam Attempt
 */
public with sharing class CredentialExamAttemptService {
    /*******************************************************************************************************
      * @description This method retrieves exam attempts for given user
      * @param userId SF id of user
      * @return List of Credential Exam Attempt
      */
       
     public List<Credential_Exam_Attempt__c> getActiveExamAttemptsForUser(String userId) {
         try {
            userInfo.getUserId();
             return [
                SELECT id, Credential__c ,Exam_Voucher__r.Expiry_Date__c , Exam_Date_Time__c,User_Credential__r.Name , User_Credential__c, Name, Exam_Voucher__c, Fail_Scorecard__c, Status__c,User__c FROM Credential_Exam_Attempt__c WHERE User_Credential__r.User__c =:userId AND ((Credential_Exam_Attempt__c.Status__c != 'Voucher Declined') AND (Credential_Exam_Attempt__c.Status__c != 'Exam Passed') AND (Credential_Exam_Attempt__c.Status__c != 'Exam Failed'))  WITH SECURITY_ENFORCED ORDER BY Exam_Date_Time__c ASC];
         } catch (Exception ex) {
             throw ex;
         }
     } 
      /*******************************************************************************************************
      * @description This method creates exam attempt record
      * @param userId SF id of user
      * @return Instance of Database.SaveResults
      */
         public List<Database.SaveResult> createExamAttempt(List<Credential_Exam_Attempt__c> examAttemptRecords){
             try {
                Database.SaveResult[] examAttemptLst= Database.insert(examAttemptRecords, true);
                return examAttemptLst;
             } catch (Exception ex) {
                 throw ex;
             }
         }
     /*******************************************************************************************************
      * @description This method updates exam date for a given Exam attempt record
      * @param userId SF id of user
      * @return Update Exam Date
      */
      public Database.SaveResult updateExamDate(String examAttemptRecordId, DateTime dt){
         try {
             Credential_Exam_Attempt__c credExamAttempt = new Credential_Exam_Attempt__c();
             credExamAttempt.Id = examAttemptRecordId;
             credExamAttempt.Exam_Date_Time__c = dt;
             return Database.update(credExamAttempt, true);
         } catch (Exception ex) {
             throw ex;
         }
      }
 
      /*******************************************************************************************************
      * @description This method updates exam attempt status
      * @param userId SF id of user
      * @return Update Exam Status
      */
      public Database.SaveResult updateExamStatus(String examAttemptRecordId, String examStatus){
         try {
             Credential_Exam_Attempt__c examAttempt = new Credential_Exam_Attempt__c();
             examAttempt.Id = examAttemptRecordId;
             examAttempt.Status__c = examStatus;
             return Database.update(examAttempt, true);
         } catch (Exception ex) {
             throw ex;
         }
      }

      /*******************************************************************************************************
      * @description This method retrieves voucher Approved  user
      * @return List of Credential Exam Attempt
      */
      public List<Credential_Exam_Attempt__c> getVoucherAssignedUser() {
        try {
           
            return [
                SELECT id, Credential__c, Name, Status__c, User_Credential__r.Credential__r.Type__c, User_Credential__r.Credential__r.Registration_fee__c, User__c FROM Credential_Exam_Attempt__c WHERE Credential_Exam_Attempt__c.Status__c = 'Voucher Approved' WITH SECURITY_ENFORCED];
               
            } catch (Exception ex) {
            throw ex;
        }
    }
/*******************************************************************************************************
      * @description This method updates exam attempt status
      * @param userId SF id of user
      * @return Update Exam Status
      */
      public Database.SaveResult updateExamRecord(String recordId, String examVoucher){
        try {
            Credential_Exam_Attempt__c examVcher = new Credential_Exam_Attempt__c();
            examVcher.Id = recordId;
            examVcher.Exam_Voucher__c = examVoucher;
            examVcher.Status__c = 'Voucher Assigned';
            return Database.update(examVcher, true);
           
        } catch (Exception ex) {
            throw ex;
        }
     }

     /*******************************************************************************************************
      * @description This method upload result records
      * @return List of Credential Exam Attempt
      */
      public List<Credential_Exam_Attempt__c> getUploadResultRecord(String recordId) {
        try {
           
            return [
                SELECT id, Credential__c ,Name, Exam_Date_Time__c,Status__c FROM Credential_Exam_Attempt__c WHERE Credential_Exam_Attempt__c.Status__c = 'Voucher Approved' WITH SECURITY_ENFORCED];
               
            } catch (Exception ex) {
            throw ex;
        }
    }

    /*******************************************************************************************************
      * @description This method updates exam attempt status
      * @param userId SF id of user
      * @return Update Exam Status
      */
      public Database.SaveResult updateParentRecord(String parentId, String status , date dt){
        try {
            User_Credential__c usrCredStatus = new User_Credential__c();
            usrCredStatus.Id = parentId;
            usrCredStatus.Completion_Date__c= dt;
            if(status == 'Exam Passed'){
                usrCredStatus.Status__c = 'Completed'; 
            }else{
                usrCredStatus.Status__c = 'Preparing'; 
            }
            return Database.update(usrCredStatus, true);
           
        } catch (Exception ex) {
            throw ex;
        }
     }
 }