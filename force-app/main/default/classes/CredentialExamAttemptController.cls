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
      @AuraEnabled(cacheable = true)
    public static map<string , object> getExamDetails(string examId){
        map<string , object> returnMap = new map<string , object>();
        list<Credential_Exam_Attempt__c> credentialsExamAttemptList = [select id , name,Credential__c from Credential_Exam_Attempt__c  where id =:examId];
        returnmap.put('ExamId',credentialsExamAttemptList[0].NaMe);
        returnmap.put('credentialId',credentialsExamAttemptList[0].Credential__c);
        return returnMap;    
    }
    /* @ description - this function is used to update cred Exam Attempt. 
@ param -examAttemptRec
*/
    @AuraEnabled()
    public static string updateCredExempt(Credential_Exam_Attempt__c examAttemptRec){
        update examAttemptRec;
        return examAttemptRec.Id;
     
    }
    
    /* @ description - this function is used to upload Reciept. 
		@ param - examid , filedata
*/
    @AuraEnabled()
    public static string uploadReciept(string parentId ,list<string> filedata){
        system.debug('StrId'+parentId);
        
        try {
            if(filedata.size()>0) {
                FilesUploadService fp = new FilesUploadService();
                fp.uploadFiles(parentId, filedata);
                
            }
            
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
        
        return 'Success';    
    }

    /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param userId SF id of user
      * @return List of Credentials Exam attempts
      */ 
      @AuraEnabled
      public static List<Credential_Exam_Attempt__c> getUploadResultsList(String recordId)
      { 
          try {
          CredentialExamAttemptService ceas = new CredentialExamAttemptService();
          List<Credential_Exam_Attempt__c> totalExamAttempts = ceas.getUploadResultRecord(recordId);
          return totalExamAttempts;  
              
          } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }  
      } 

      /*******************************************************************************************************
      * @description Returns Credentials Exam attempts that are in progress
      * @param examAttemptRecordId and  examStatus of credential Exam Attempts
      */ 
    @AuraEnabled
    public static void parentStatus(String parentId, String status, date dt)
    {
        try {
            CredentialExamAttemptService ceas = new CredentialExamAttemptService();
            ceas.updateParentRecord(parentId,status, dt); 
        } catch (AuraHandledException  ex) {
            throw ex;
        }     
    } 
}