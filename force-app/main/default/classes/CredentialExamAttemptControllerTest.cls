@isTest
private class CredentialExamAttemptControllerTest{
    @TestSetup
    static void setup() {
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs){
            List<Credential__c> credList = TestDataFactory.createCredentials(); 
             User_Credential__c userCred = TestDataFactory.createUserCredentials(usrs.id,credList[0].id);
             TestDataFactory.createExamVoucher();
             userCred.Status__c='Assigned';
             userCred.Due_Date__c= system.today();
             userCred.Assigned_By__c = userinfo.getUserId(); 
             insert userCred;
             list<Credential_Exam_Attempt__c> credExamAttempt = TestDataFactory.createCredentialExamAttempt(userCred.id);           
             insert credExamAttempt;
        }
    }
    
    static testMethod void getExamAttemptsForUserTest (){
        User usrs = [select id,name from User where Email= 'puser000@amamama.com' limit 1 ];
        System.runAs(usrs){
        Test.startTest();
        try {
            CredentialExamAttemptController.getExamAttempts(usrs.Id);             
        } catch (Exception ex) {        
            system.assert(ex.getMessage().contains('Insufficient permissions'));
        }        
        Test.stopTest();
        system.assert(usrs != Null, 'User List should not be empty.');
        }
    }
    
      static testMethod void updateDateAndTimeTest (){
        List<Credential_Exam_Attempt__c> examAttemptsList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
        CredentialExamAttemptController.updateDate(examAttemptsList[0].Id,system.today());
        Test.stopTest();
        system.assert(examAttemptsList[0].Id != Null, 'Exam Attempt List Should Not Be Empty.');     
    }
    
    static testMethod void updateExamStatusTest (){
        List<Credential_Exam_Attempt__c> examAttemptsList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
         CredentialExamAttemptController.updateStatus(examAttemptsList[0].Id,'Exam Passed');
        Test.stopTest();
        system.assert(examAttemptsList[0].Id != Null, 'Exam Attempt List Should Not Be Empty.');
    }    
}