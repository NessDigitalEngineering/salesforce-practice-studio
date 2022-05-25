@isTest
public class UserCredentialServiceTest{
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
        
        Credential__c c1 =new Credential__c ();
        c1.Name ='Platform Developer I';
        c1.Status__c='Active';
        c1.Program_Level__c='L1';
        c1.Type__c='Trailhead';
        insert c1;
        User_Credential__c uc1 = new User_Credential__c ();
        uc1.Credential__c =c1.id;
        uc1.status__c = 'Assigned';        
        insert uc1;  
    }
    static testMethod void getCredentialsTest() 
    {
       
         String userId;
         
         User us = [Select Id from User where alias='UUser'];
         List<User_Credential__c> userCredentials= [Select Credential__r.Name, Status__c, User__c from User_Credential__c limit 2];
        Test.startTest();
        list<User_Credential__c> usercred = UserCredentialService.getCompletedUserCredentials(userId);

        list<User_Credential__c> usercred1 = UserCredentialService.getActiveUserCredentials(userId);
        
        //list<Database.SaveResult> usercred2 = UserCredentialService.createUserCredentials(userCredentials);
        System.runAs(us){
            try{
                list<Database.SaveResult> usercred2 = UserCredentialService.createUserCredentials(userCredentials);
                
            } catch (Exception ex) {
                System.assertEquals('', ex.getMessage());
            }  
        }
        list<Database.SaveResult> usercred3 = UserCredentialService.updateUserCredentials(userCredentials);
        
       // list<Database.SaveResult> usercred5 = UserCredentialService.updateUserCredentials(Null);
        Test.stopTest();               
    }
  /*  static testMethod void getupdateCredentialsTest(){
        list<User_Credential__c> usercred10 = UserCredentialService.getActiveUserCredentials(Null);
        list<User_Credential__c> usercred11 = UserCredentialService.getActiveUserCredentials('');
        list<Database.SaveResult> usercred12 = UserCredentialService.createUserCredentials(Null);
        //list<Database.SaveResult> credusr = UserCredentialService.createUserCredentials('');
        list<Database.SaveResult> usercred13 = UserCredentialService.updateUserCredentials(Null);
        //list<Database.SaveResult> credusr1 = UserCredentialService.updateUserCredentials('');
    }*/
}