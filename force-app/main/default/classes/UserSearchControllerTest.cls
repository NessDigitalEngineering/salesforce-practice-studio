@isTest
public class UserSearchControllerTest {
    
    @TestSetup
    static void setup() {
        
        // For create role
        UserRole r = new UserRole(DeveloperName = 'MyCustomRole', Name = 'My Role');
        insert r;
        
        //For create user
        User userName = new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'System Administrator'].Id,
            LastName = 'admin',
            Email = 'puser000@amamama.com',
            Username = 'puser000@amamama.com' + System.currentTimeMillis(),
            CompanyName = 'TEST',
            Title = 'title',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            UserRoleId = r.Id
        );
    }
    
    static testMethod void getUsersTest() {
       
        User usersName = [SELECT Id,name FROM User limit 1]; 
        Test.startTest();
        List<User> users=UserSearchController.getUsers(u.Name);
        Test.stopTest();
        System.assertNotEquals(0, usersName.size());
        
    }
    
}