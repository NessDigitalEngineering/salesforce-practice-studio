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
     @AuraEnabled(cacheable=true)
     public static List<Credential_Exam_Attempt__c> getExamAttemptsForUser(String userId) {
         try {
             return [
                 SELECT id, Credential__c, Exam_Date_Time__c, Name, Exam_Voucher__c, Fail_Scorecard__c, Status__c,User__c
                 FROM Credential_Exam_Attempt__c
                 WHERE Name= :userId AND (Credential_Exam_Attempt__c.Status__c != 'Completed' OR Credential_Exam_Attempt__c.Status__c != 'Exam Passed' OR Credential_Exam_Attempt__c.Status__c != 'Exam Failed')];
         } catch (Exception ex) {
             throw ex;
         }
     }
      /*******************************************************************************************************
      * @description This method creates exam attempt record
      * @param userId SF id of user
      * @return List of create Exam Attempt
      */
         public List<Database.SaveResult> createExamAttempt(List<Credential_Exam_Attempt__c> examAttemptRecords){
             try {
                 return Database.insert(examAttemptRecords, true);
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
 }