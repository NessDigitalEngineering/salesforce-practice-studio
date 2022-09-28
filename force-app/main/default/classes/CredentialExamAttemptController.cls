/**
 * @author Dipshika Nalawade
 * @date   27/08/2022
 * @description controller Class containing methods  to call service class methods Credential Exam Attempt
 */
public with sharing class CredentialExamAttemptController{
    /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param userId SF id of user
      * @return List of Credentials Exam attempts
      */ 
    @AuraEnabled
    public static List<Credential_Exam_Attempt__c> getExamAttempts(String userId)
    {
        try {
            system.debug('==>userId'+userId);
        CredentialExamAttemptService ceas = new CredentialExamAttemptService();
        List<Credential_Exam_Attempt__c> totalExamAttempts = ceas.getActiveExamAttemptsForUser(userId);
        system.debug('==>totalExamAttempts'+totalExamAttempts);
        return totalExamAttempts;  
        } catch (AuraHandledException  ex) {
            throw ex;
        }   
    } 
 /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param examAttemptRecordId and  examStatus of credential Exam Attempts
      */ 
    @AuraEnabled
    public static void updateStatus(String examAttemptRecordId, String examStatus)
    {
        try {
            CredentialExamAttemptService ceas = new CredentialExamAttemptService();
            ceas.updateExamStatus(examAttemptRecordId,examStatus); 
        } catch (AuraHandledException  ex) {
            throw ex;
        }     
    } 

     /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param examAttemptRecordId and dt of  credential exam Attempts
      */ 
    @AuraEnabled
    public static void updateDate(String examAttemptRecordId, DateTime dt)
    {
        try {
            CredentialExamAttemptService ceas = new CredentialExamAttemptService();
        ceas.updateExamDate(examAttemptRecordId,dt);
        } catch (AuraHandledException  ex) {
            throw ex;
        }    
    } 
}