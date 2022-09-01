/**
 * @author Dipshika Nalawade
 * @date   04/08/2022
 * @description controller Class containing methods  to call service class methods Credential Exam Attempt
 */
public with sharing class credentialExamAttemptController {
    /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param userId SF id of user
      * @return List of Credentials Exam attempts
      */ 
    @AuraEnabled
    public static List<Credential_Exam_Attempt__c> getExamAttempts(String userId)
    {
        system.debug('==>userId'+userId);
        CredentialExamAttemptService ceas = new CredentialExamAttemptService();
        List<Credential_Exam_Attempt__c> totalExamAttempts = ceas.getExamAttemptsForUser(userId);
        system.debug('==>totalExamAttempts'+totalExamAttempts);
        return totalExamAttempts;  
    } 
}
