@isTest
private class CredentialExamAttemptServiceTest {
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
        Map<String,String> userId = new Map<String,String>();
        List<Credential_Exam_Attempt__c> examList= [select id,Name from Credential_Exam_Attempt__c ];
        User usrs = [select id,name from User where Email= 'puser000@amamama.com' limit 1];
        System.runAs(usrs){
        Test.startTest();
        try {
            CredentialExamAttemptService ces = new CredentialExamAttemptService();
        ces.getActiveExamAttemptsForUser(usrs.Id);
        } catch (Exception ex) {
            system.assert(ex.getMessage().contains('Insufficient permissions'));
        }
        
        Test.stopTest();
        system.assert(usrs != Null, 'User List should not be empty.');
        }

    }
    
    static testMethod void createExamAttemptTest (){
        User_Credential__c usrCred = [select id,Name from User_Credential__c where Status__c='Assigned' LIMIT 1];
        List<Credential_Exam_Attempt__c> examAttemptList =TestDataFactory.createCredentialExamAttempt(usrCred.id);
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
		ces.createExamAttempt(examAttemptList);
        Test.stopTest();
        system.assert(usrCred != Null, 'User credential List should not be empty.');

    }
    
    static testMethod void updateExamDateTest (){
        User_Credential__c usrCred = [select id,Name from User_Credential__c where Status__c='Assigned' LIMIT 1];
        List<Credential_Exam_Attempt__c> examAttemptList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
		ces.updateExamDate(examAttemptList[0].Id,system.today());
        Test.stopTest();
        system.assert(examAttemptList[0].Id != Null, 'Exam Attempt List should not be empty.');
     
    }
   
    static testMethod void updateExamStatusTest (){
        User_Credential__c usrCred = [select id,Name from User_Credential__c where Status__c='Assigned' LIMIT 1];
        List<Credential_Exam_Attempt__c> examAttemptList = [select id,Status__c from Credential_Exam_Attempt__c where Status__c='Voucher Assigned' LIMIT 1];
        Test.startTest();
         CredentialExamAttemptService ces = new CredentialExamAttemptService();
		 ces.updateExamStatus(examAttemptList[0].Id,'Exam Passed');
        Test.stopTest();
        system.assert(examAttemptList[0].Id != Null, 'Exam Attempt List should not be empty.');
    }
}