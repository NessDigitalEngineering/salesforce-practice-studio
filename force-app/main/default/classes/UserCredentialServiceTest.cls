@IsTest
private class UserCredentialServiceTest {
    /*@TestSetup
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
           // List<User_Credential__c> ucList = ucService.getCompletedUserCredentials(usr.Id);
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
               // List<User_Credential__c> ucList = ucService.getCompletedUserCredentials(usr.id);
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
    }*/
}
