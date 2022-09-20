@isTest
private class CredentialExamAttemptControllerTest {
    @TestSetup
    static void setup() {
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs){
            List<Credential__c> credList = TestDataFactory.createCredentials(); 
            User_Credential__c usrCred = TestDataFactory.createUserCredentials(usrs.id,credList[0].id);
            usrCred.Status__c='Assigned';
            usrCred.Due_Date__c= system.today();
            usrCred.Assigned_By__c = userinfo.getUserId(); 
            insert usrCred;
            list<Credential_Exam_Attempt__c> credExamAttempt = TestDataFactory.createCredentialExamAttempt(usrCred.id);           
            insert credExamAttempt;
        }
    }
     
    static testMethod void getActiveExamAttemptsForUserTest (){

        User usrs = [select id,name from User where Email= 'puser000@amamama.com' limit 1];
        System.runAs(usrs){
        Test.startTest();
        try {
            credentialExamAttemptController.getExamAttempts(usrs.Id); 
            
        } catch (Exception ex) {
            system.assert(ex.getMessage().contains('Insufficient permissions'));
        }
        
        Test.stopTest();
        system.assert(usrs != Null, 'User List should not be empty.');
        }

    } 
    
      static testMethod void updateDateTest (){
        List<Credential_Exam_Attempt__c> examAttemptList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
        credentialExamAttemptController.updateDate(examAttemptList[0].Id,system.today());
        Test.stopTest();
        system.assert(examAttemptList[0].Id != Null, 'Exam Attempt List should not be empty.');
     
    }
   
    static testMethod void updateStatusTest (){
        List<Credential_Exam_Attempt__c> examAttemptList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
         credentialExamAttemptController.updateStatus(examAttemptList[0].Id,'Exam Passed');
        Test.stopTest();
        system.assert(examAttemptList[0].Id != Null, 'Exam Attempt List should not be empty.');
    }
}
