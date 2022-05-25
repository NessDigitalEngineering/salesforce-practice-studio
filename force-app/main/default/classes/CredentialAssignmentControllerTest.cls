@isTest
public class CredentialAssignmentControllerTest {
    
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
        uc.status__c = 'Ready';
        
        insert uc;
    }
    
    static testMethod void getCredentialsTest() {
        list<Id> credentialsId = new list<Id> (); 
        Credential__c c = [SELECT Id FROM Credential__c limit 1 ];
        credentialsId.add(c.id);
      Test.startTest();
        List<User_Credential__c> credentials=CredentialAssignmentController.getUserCredentials(credentialsId);
      Test.stopTest();
        System.assertNotEquals(0, credentials.size());
    }

}