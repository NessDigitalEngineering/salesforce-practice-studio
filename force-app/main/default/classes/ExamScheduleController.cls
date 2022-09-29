public class ExamScheduleController {
   @AuraEnabled(cacheable = true)
    public static map<string , object> getExamDetails(string examId){
        map<string , object> returnMap = new map<string , object> ();
        list<Credential_Exam_Attempt__c> CredentialsExamAttemptList = [select id , name,Credential__c from Credential_Exam_Attempt__c  where id =:examId];
   
        
        /*    list<map<string , string>> Attemptlist = new  list<map<string , string>>();
        list<map<string , string>> CredentialsList = new  list<map<string , string>>();
        for(Credential_Exam_Attempt__c cce :CredentialsExamAttemptList){
            Attemptlist.add(new map<string , string>{'label' => cce.Name , 'value'=>cce.Id});
        }
        
        list<Credential__c> Credentials = [select Id , Name from Credential__c ];
        for(Credential__c cc : Credentials ){
            CredentialsList.add(new map<string , string>{'label' => cc.Name , 'value'=>cc.Id});
        }
    */
       // returnMap.put('CredAttempts',Attemptlist);
       //  returnMap.put('Credentials',CredentialsList);
           
        returnmap.put('ExamId',CredentialsExamAttemptList[0].NaMe);
        returnmap.put('credentialId',CredentialsExamAttemptList[0].Credential__c);
        return returnMap;    
    }
    
    @AuraEnabled()
    public static string UpdateCredExempt(Credential_Exam_Attempt__c examAttemptRec){
      	update examAttemptRec;
        return examAttemptRec.Id;
        
        
    }
  
  @AuraEnabled()
         public static string UploadReciept(string ParentId ,list<string> filedata){
			system.debug('StrId'+ParentId);
       
        try {
            if(filedata.size()>0) {
               FilesUploadService fp = new FilesUploadService();
               fp.uploadFiles(ParentId, filedata);
             
            }
                     
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
             
             return 'Success';    
         }

}