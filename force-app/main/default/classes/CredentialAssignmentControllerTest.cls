@isTest
private class CredentialAssignmentControllerTest {
    
    @TestSetup
    static void setup() {
        
    TestDataFactory.createCredentials();      
    }
    
    static testMethod void getCredentialsTest() {
        Map<String,String> credentialsId = new Map<String,String>(); 
        Credential__c c = [SELECT Id,name FROM Credential__c limit 1];
        credentialsId.put(c.id,c.name);
        User usrs = TestDataFactory.createUser();
        User_Credential__c usrCred = TestDataFactory.createUserCredentials(usrs.id,c.id);
        usrCred.Status__c='Ready';
        insert usrCred;

    
        Test.startTest();
        CredentialAssignmentController.getUserCredentials(credentialsId,usrs.Id);
        Test.stopTest();
  
    }
    static testMethod void insertCredAssignmentsTest() {
        Credential__c c = [SELECT Id,name FROM Credential__c limit 1];
        List<CredentialAssignmentController.CredentialData>  credenlsData = new  List<CredentialAssignmentController.CredentialData>();
        CredentialAssignmentController.CredentialData newData= new CredentialAssignmentController.CredentialData();
        newData.status='';
        newData.assignedDate=system.today();
        newData.credId= c.id;
        newData.credName=c.Name;
        credenlsData.add(newData);
        
        Test.startTest();
        CredentialAssignmentController.insertCredAssignments(credenlsData);
        Test.stopTest();
        
    } 
    
}