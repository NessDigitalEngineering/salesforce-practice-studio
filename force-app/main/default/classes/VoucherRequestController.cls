public class VoucherRequestController {
    @AuraEnabled()
    public static string createCredExempt(Credential_Exam_Attempt__c examAttemptRec){
        try{
            insert examAttemptRec;
            
        }
        catch(exception e){
            system.debug('Error :'+e.getMessage() + 'at line number:' + 'due to'+e.getCause() );
            
        }     
        return examAttemptRec.Id;
        
  
    }
    
    @AuraEnabled()
    public static string methodVRC(String strId, list<map<string , object>> filedata)
    {
   	system.debug('StrId'+strid);
       
        try {
            if(filedata.size()>0) {
                FilesUploadService.uploadDocuments(strId, filedata);
            }
                
                
            
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
        
        return 'Success';
    }
}