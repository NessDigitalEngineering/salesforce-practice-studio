@isTest
public class CredentialSearchControllerTest {
    
    @TestSetup
    static void setup() {
        
        Credential__c c =new Credential__c ();
        c.Name ='Admin';
        c.Status__c='Active';
        c.Program_Level__c='L1';
        c.Type__c='Trailhead';
        insert c;
        
    }
    
    static testMethod void getCredentialsTest() {
        Credential__c c = [SELECT Id,name FROM Credential__c limit 1];
        List<String> searchLists;

        Test.startTest();
        List<Credential__c> credentials=CredentialSearchController.getCredentials(c.Name,searchLists);
        Test.stopTest();
        System.assertNotEquals(0, credentials.size());
        
    }
    
}