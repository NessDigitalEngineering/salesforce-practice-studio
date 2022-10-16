/**
 * @author Lavanya Bonthala
 * @date   13/10/2022
 * @description Apex controller for credentialExamAttempts component
 */
public with sharing class ExamScheduleController {
    /* 
    * @author Lavanya Bonthala
    * @date   13/10/2022
    @ description - this function is used to fetch the ExamDetails. 
	   @ param -examId
*/
    @AuraEnabled(cacheable = true)
    public static map<string , object> getExamDetails(string examId){
        map<string , object> returnMap = new map<string , object> ();
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
}