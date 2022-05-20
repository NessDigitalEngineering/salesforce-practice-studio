@isTest

public class earnedCredentialsControllerTest {

    @TestSetup
    static void setup() {
        
        Credential__c c =new Credential__c ();
        c.Name ='Admin';
        c.Status__c='Active';
        c.Program_Level__c='L1';
        c.Type__c='Trailhead';
        insert c;
        User_Credential__c uc = new User_Credential__c ();
        uc.Credential__c =c.id;
        uc.status__c = 'Completed';
        
        insert uc;
        
    }
static testMethod void getCredentialsTest() {
        User_Credential__c c = [SELECT Id,name FROM User_Credential__c limit 1];
        List<String> searchLists;
         String userId;
        Test.startTest();
        List<User_Credential__c> credentials = earnedCredentialsController.getUserCredentials(userId);
        Test.stopTest();
        System.assertNotEquals(0, credentials.size());
        
    }
}