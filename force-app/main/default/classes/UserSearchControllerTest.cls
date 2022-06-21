@isTest
private class UserSearchControllerTest {
    
    @TestSetup
    static void setup() {
        
        //For create user
        TestDataFactory.createUser();
    }
    
    static testMethod void getUsersTest() {
       
        User usersName = [SELECT Id,name FROM User limit 1]; 
        System.runAs(usersName){
        Test.startTest();
        List<User> userList = UserSearchController.getUsers(usersName.Name);
        Test.stopTest();
        System.assertNotEquals(0, userList.size());
        
        }
        
    }
    
}