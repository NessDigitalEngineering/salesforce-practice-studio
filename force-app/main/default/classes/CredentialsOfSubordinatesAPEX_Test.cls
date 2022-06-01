@IsTest
public with sharing class CredentialsOfSubordinatesAPEX_Test {
    @TestSetup
    static void makeData(){
        TestDataFactory.createCredentials();        
    }
    @IsTest
    public static void getCredentialsOfSubordinates_Test() {
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        User subordinate = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(subordinate);
        subordinate.ManagerId=usr.Id;
        update subordinate;
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredential = TestDataFactory.createUserCredentials(subordinate.Id,credential.id);
            usrCredential.Status__c = 'Preparing';
            insert usrCredential;
            system.debug(usrCredential);
            Test.startTest();
            List<CredentialsOfSubordinatesAPEX.subordinateCredentialsInfo> sciList = CredentialsOfSubordinatesAPEX.getCredentialsOfSubordinates(usr.Id);
            Test.stopTest();
        }
    }
}
