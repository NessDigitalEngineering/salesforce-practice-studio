@isTest
private class CredentialAssignmentControllerTest {
    @TestSetup
    static void setup() {
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs) {
            List<Credential__c> credList = TestDataFactory.createCredentials();
            User_Credential__c usrCred = TestDataFactory.createUserCredentials(usrs.id, credList[0].id);
            usrCred.Status__c = 'Preparing';
            usrCred.Due_Date__c = system.today();
            usrCred.Assigned_By__c = userinfo.getUserId();
            insert usrCred;
        }
    }

    static testMethod void getCredentialsTest() {
        Map<String, String> credentialsId = new Map<String, String>();
        List<Credential__c> credList = [SELECT Id, name FROM Credential__c];
        for (Credential__c cred : credList) {
            credentialsId.put(cred.id, cred.name);
        }
        User usrs = [SELECT id, name FROM User WHERE Email = 'puser000@amamama.com' LIMIT 1];
        System.runAs(usrs) {
            Test.startTest();
            List<CredentialAssignmentController.CredentialData> data = CredentialAssignmentController.getUserCredentials(usrs.Id);
            Test.stopTest();
            System.assertEquals('Preparing', data[0].status, 'Success check');
        }

    }
    static testMethod void insertCredAssignmentsTest() {
        Credential__c c = [SELECT Id, name FROM Credential__c WHERE Name = 'Platform Developer I' LIMIT 1];
        User usrs = [SELECT id, name FROM User WHERE Email = 'puser000@amamama.com' LIMIT 1];
        List<CredentialAssignmentController.CredentialData> credenlsData = new List<CredentialAssignmentController.CredentialData>();
        CredentialAssignmentController.CredentialData newData = new CredentialAssignmentController.CredentialData();
        newData.status = '';
        newData.assignedDate = system.today();
        newData.credId = c.id;
        newData.credName = c.Name;
        newData.assigneId = usrs.id;
        credenlsData.add(newData);
        System.runAs(usrs) {
            Test.startTest();
            CredentialAssignmentController.insertCredAssignments(credenlsData);
            Test.stopTest();
        }

        System.assertEquals(
            'Platform Developer I',
            [SELECT Credential__r.Name FROM User_Credential__c WHERE User__c = :usrs.Id AND status__c = 'Assigned'][0]
            .Credential__r.Name,
            'Success check'
        );
    }
}
