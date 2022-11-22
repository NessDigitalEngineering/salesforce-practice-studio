@isTest
private class CredentialSearchControllerTest {
    @TestSetup
    static void setup() {
        TestDataFactory.createCredentials();
    }

    static testMethod void getCredentialsTest() {
        Credential__c c = [SELECT Id, name FROM Credential__c LIMIT 1];
        User usrs = TestDataFactory.createUser();
        List<String> searchLists;

        System.runAs(usrs) {
            Test.startTest();
            List<Credential__c> credentials = CredentialSearchController.getCredentials(c.Name, searchLists, usrs.id);
            Test.stopTest();
            System.assertNotEquals(0, credentials.size());
        }
    }
}
