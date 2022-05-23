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
       
         String userId;
        Test.startTest();
        List<User_Credential__c> Cred = earnedCredentialsController.getUserCredentials(userId);
        Test.stopTest();               
    }
}
