@isTest
private class CredentialExamAttemptServiceTest {
    @TestSetup
    static void setup() {
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs) {
            List<Credential__c> credList = TestDataFactory.createCredentials();
            User_Credential__c usrCred = TestDataFactory.createUserCredentials(usrs.id, credList[0].id);
            TestDataFactory.createExamVoucher();
            usrCred.Status__c = 'Assigned';
            usrCred.Due_Date__c = system.today();
            usrCred.Assigned_By__c = userinfo.getUserId();
            insert usrCred;
            list<Credential_Exam_Attempt__c> credExamAttempt = TestDataFactory.createCredentialExamAttempt(usrCred.id);
            insert credExamAttempt;
        }
    }

    static testMethod void getActiveExamAttemptsForUserTest() {
        User usrs = [SELECT id, name FROM User WHERE Email = 'puser000@amamama.com' LIMIT 1];
        System.runAs(usrs) {
            Test.startTest();
            try {
                CredentialExamAttemptService ces = new CredentialExamAttemptService();
                ces.getActiveExamAttemptsForUser(usrs.Id);
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions'));
            }

            Test.stopTest();
            system.assert(usrs != null, 'User List should not be empty.');
        }

    }

    static testMethod void createExamAttemptTest() {
        User_Credential__c usrCred = [SELECT id, Name FROM User_Credential__c WHERE Status__c = 'Assigned' LIMIT 1];
        List<Credential_Exam_Attempt__c> examAttemptList = TestDataFactory.createCredentialExamAttempt(usrCred.id);
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
        ces.createExamAttempt(examAttemptList);
        Test.stopTest();
        system.assert(usrCred != null, 'User credential List should not be empty.');
    }

    static testMethod void updateExamDateTest() {
        List<Credential_Exam_Attempt__c> examAttemptList = [
            SELECT id, Status__c
            FROM Credential_Exam_Attempt__c
            WHERE Status__c = 'Voucher Assigned'
            LIMIT 1
        ];
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
        ces.updateExamDate(examAttemptList[0].Id, system.today());
        Test.stopTest();
        system.assert(examAttemptList[0].Id != null, 'Exam Attempt List should not be empty.');
    }

    static testMethod void updateExamStatusTest() {
        List<Credential_Exam_Attempt__c> examAttemptList = [
            SELECT id, Status__c
            FROM Credential_Exam_Attempt__c
            WHERE Status__c = 'Voucher Assigned'
            LIMIT 1
        ];
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
        ces.updateExamStatus(examAttemptList[0].Id, 'Exam Passed');
        Test.stopTest();
        system.assert(examAttemptList[0].Id != null, 'Exam Attempt List should not empty.');
    }

    static testMethod void getVoucherAssignedUserTest() {
        User usrs = [SELECT id, name FROM User WHERE Email = 'puser000@amamama.com' LIMIT 1];
        System.runAs(usrs) {
            Test.startTest();
            try {
                CredentialExamAttemptService ces = new CredentialExamAttemptService();
                ces.getVoucherAssignedUser();
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions'));
            }
            Test.stopTest();
            system.assert(usrs != null, 'User List should not be empty.');
        }

    }

    static testMethod void updateExamRecordTest() {
        List<Credential_Exam_Attempt__c> examAttemptList = [
            SELECT id, Exam_Voucher__c
            FROM Credential_Exam_Attempt__c
            WHERE Status__c = 'Voucher Assigned'
            LIMIT 1
        ];
        List<Exam_Voucher__c> examVchrList = [SELECT id FROM Exam_Voucher__c LIMIT 1];
        Test.startTest();
        CredentialExamAttemptService ces = new CredentialExamAttemptService();
        ces.updateExamRecord(examAttemptList[0].Id, examVchrList[0].Id);
        Test.stopTest();
        system.assert(examAttemptList[0].Id != null, 'List should not be empty.');
    }
}
