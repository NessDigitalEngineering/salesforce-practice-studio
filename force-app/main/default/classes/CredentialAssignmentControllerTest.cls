@isTest
public class CredentialAssignmentControllerTest {
    
    @TestSetup
    static void setup() {
        
        Credential__c c1 =new Credential__c ();
        c1.Name ='Admin';
        c1.Status__c='Active';
        c1.Program_Level__c='L1';
        c1.Type__c='Trailhead';
        insert c1;
        Credential__c c2 =new Credential__c ();
        c2.Name ='Service Cloud';
        c2.Status__c='Active';
        c2.Program_Level__c='L1';
        c2.Type__c='Trailhead';
        insert c2;
        User_Credential__c uc = new User_Credential__c ();
        uc.Credential__c =c1.id;
        uc.status__c = 'Ready';
        
        insert uc;
    }
    
    static testMethod void getCredentialsTest() {
        list<Id> credentialsId = new list<Id> (); 
        List<Credential__c> c = [SELECT Id FROM Credential__c where name ='Service cloud'];
        credentialsId.add(c[0].id);
        
        String userId;
      Test.startTest();
        CredentialAssignmentController.getUserCredentials(credentialsId,userId);
                          
      Test.stopTest();
        
    }

}