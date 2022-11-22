@isTest
private class CredentialTrackingControllerTest {
    @isTest
    private static void getUserCredentials() {
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs) {
            TestDataFactory.createCredentials();
            List<Credential__c> creds = [SELECT id FROM Credential__c LIMIT 1];
            TestDataFactory.createUserCredentials(usrs.Id, creds[0].Id);
            User_Credential__c uc = TestDataFactory.createUserCredentials(usrs.id, creds[0].Id);
            insert uc;
            List<User_Credential__c> ucList = CredentialTrackingController.getUserCredentials(usrs.id);
            system.assert(ucList.size() > 0);
            CredentialTrackingController.updateUserCredential(ucList[0].Id, ucList[0].Status__c);
        }
    }
}
