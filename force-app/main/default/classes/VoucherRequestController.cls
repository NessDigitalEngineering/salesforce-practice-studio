/*
 * @author Lavanya Bonthala
 * @date   13/09/2022
 * @description Service Class containing methods that helps to request Voucher for Exam attempt
 */
public class VoucherRequestController {
 /*******************************************************************************************************
      * @description This method creates Credential Exam Attempt object
      * @param examAttemptRec SF Id of Credential Exam Attempt
      * @return Id of the inserted record
      */ 
    @AuraEnabled()
    public static string createCredExempt(Credential_Exam_Attempt__c examAttemptRec){
       list<Database.SaveResult> saveResults;
        try{
        	list<Credential_Exam_Attempt__c> examAttemptList = new list<Credential_Exam_Attempt__c>();
            examAttemptList.add(examAttemptRec);
        saveResults = CredentialExamAttemptService.createExamAttempt(examAttemptList);
        
           system.debug('RecId:'+ saveResults[0].Id);
            }
            
                   catch(exception e){
            system.debug('Error :'+e.getMessage() + 'at line number:' + 'due to'+e.getCause() );
            
        }     
        return  saveResults[0].Id;
        
    }

    /*******************************************************************************************************
      * @description This method uploads file specific to record Id
      * @param  recid SF id of the record inserted, filedata content of the file
      * @return  Success message on file upload
      */
    
  /*  @AuraEnabled()
    public static string methodVRC(string recid,list<map<string , object>> filedata)
    {
   	system.debug('StrId'+recid);
       
        try {
            if(filedata.size()>0) {
                FilesUploadService.uploadDocuments(recid, filedata);
            }
                     
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
        
        return 'Success';
    }
    */
}