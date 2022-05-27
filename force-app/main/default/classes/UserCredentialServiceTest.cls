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

/*@IsTest
private class UserCredentialServiceTest {
    @TestSetup
    static void makeData(){
        TestDataFactory.createCredentials();        
    }

    @IsTest
    private static void getActiveUserCredentialsTest(){
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';
            insert usrCredentials;

            Test.startTest();
            UserCredentialService ucService = new UserCredentialService();
            List<User_Credential__c> ucList = ucService.getActiveUserCredentials(usr.Id);
            Test.stopTest();

            System.assertEquals(credential.Id, [Select Credential__c from User_Credential__c where user__c =:usr.id][0].Credential__c, 'Testing whether active User Credential record is fetched');
        }
    }

    @IsTest
    private static void getActiveUserCredentialsTestException(){
        User usr = TestDataFactory.createUser();
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';
            insert usrCredentials;
            try {
                UserCredentialService ucService = new UserCredentialService();
                List<User_Credential__c> ucList = ucService.getActiveUserCredentials(usr.Id);
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions'));
            }
        }
    }

    @IsTest
    private static void getCompletedUserCredentialsTest(){
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer I'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Completed';
            insert usrCredentials;

            Test.startTest();
            UserCredentialService ucService = new UserCredentialService();
            List<User_Credential__c> ucList = ucService.getCompletedUserCredentials(usr.Id);
            Test.stopTest();

            System.assertEquals(credential.Id, [Select Credential__c from User_Credential__c where user__c =:usr.id][0].Credential__c, 'Testing whether completed User Credential record is fetched');
        }
    }

    @IsTest
    private static void getCompletedUserCredentialsTestException(){
        User usr = TestDataFactory.createUser();
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer I'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Completed';
            insert usrCredentials;
            try {
                UserCredentialService ucService = new UserCredentialService();
                List<User_Credential__c> ucList = ucService.getCompletedUserCredentials(usr.id);
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions'));                
            }
        }
    }

    @IsTest
    private static void createUserCredentialsTest(){
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';

            Test.startTest();
            UserCredentialService ucService = new UserCredentialService();
            List<Database.SaveResult> result = ucService.createUserCredentials(new List<User_Credential__c>{usrCredentials});
            Test.stopTest();

            System.assertEquals(credential.Id, [Select Credential__c from User_Credential__c][0].Credential__c, 'Sucessfull test of creating user credentials');
        }
    }

    @IsTest
    private static void createUserCredentialsTestException(){
        User usr = TestDataFactory.createUser();
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';
            try {
                UserCredentialService ucService = new UserCredentialService();
                List<Database.SaveResult> result = ucService.createUserCredentials(new List<User_Credential__c>{usrCredentials});
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions')); 
            }
        }
    }

    @IsTest
    private static void updateUserCredentialsTest(){
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';
            insert usrCredentials;

            Test.startTest();
            UserCredentialService ucService = new UserCredentialService();
            List<Database.SaveResult> result = ucService.updateUserCredentials(new List<User_Credential__c>{new User_Credential__c(Id=usrCredentials.Id,Status__c='Completed')});
            Test.stopTest();

            System.assertEquals('Completed', [Select name,status__c from User_Credential__c][0].Status__c, 'Sucessfull test of updating user credentials');
        }
    }

    @IsTest
    private static void updateUserCredentialsTestException(){
        User usr = TestDataFactory.createUser();
        System.runAs(usr){
            Credential__c credential = [Select id,name from Credential__c where name = 'Platform Developer II'][0];
            User_Credential__c usrCredentials = TestDataFactory.createUserCredentials(usr.Id,credential.id);
            usrCredentials.Status__c = 'Preparing';
            insert usrCredentials;
            try {
                UserCredentialService ucService = new UserCredentialService();
                List<Database.SaveResult> result = ucService.updateUserCredentials(new List<User_Credential__c>{new User_Credential__c(Id=usrCredentials.Id,Status__c='Completed')});
    
            } catch (Exception ex) {
                system.assert(ex.getMessage().contains('Insufficient permissions')); 
            }
        }
    }
}
*/
