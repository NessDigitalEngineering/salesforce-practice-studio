/*
 * @author Lavanya Bonthala
 * @date   13/09/2022
 * @description Service Class containing methods that helps to request Voucher for Exam attempt
 */
public with sharing class VoucherRequestController {

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

            saveResults = new CredentialExamAttemptService().createExamAttempt(examAttemptList);
        
            system.debug('RecId:'+ saveResults[0].Id);
        }
            
        catch(exception e){
            throw new AuraHandledException(e.getMessage());

            
        }     
        return  saveResults[0].Id;
        
    }

    /*******************************************************************************************************
      * @description This method uploads file specific to record Id
      * @param  recid SF id of the record inserted, filedata content of the file
      * @return  Success message on file upload
      */
    
    @AuraEnabled()
    public static string methodVRC(string ParentRecId,list<string>filedata)
    {
   			system.debug('StrId'+ParentRecId);
       
        try {
            if(filedata.size()>0) {
               FilesUploadService fp = new FilesUploadService();
               fp.uploadFiles(ParentRecId, filedata);
             
            }
                     
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
        
        return 'Success';
    }
    /*******************************************************************************************************
      * @description Returns all Exam Vouchers Available that are in progress
      * @return List of Voucher Approved
      */ 
      @AuraEnabled
      public static List<Exam_Voucher__c> getAllExamVouchers(string credentialType, integer credentialCost)
      { 
          try {
            ExamVoucherService vas = new ExamVoucherService();
          List<Exam_Voucher__c> totalExamVouchers = vas.getAvailableExamVouchers(credentialType,credentialCost);
          return totalExamVouchers;  
              
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }  
      } 
}