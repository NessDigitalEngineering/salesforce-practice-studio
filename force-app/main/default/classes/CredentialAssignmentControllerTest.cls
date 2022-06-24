@isTest
private class CredentialAssignmentControllerTest {
    
    @TestSetup
    static void setup() {
        
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs){
            List<Credential__c> credList = TestDataFactory.createCredentials(); 
            User_Credential__c usrCred = TestDataFactory.createUserCredentials(usrs.id,credList[0].id);
            usrCred.Status__c='Ready';
            usrCred.Due_Date__c= system.today();
            usrCred.Assigned_By__c = userinfo.getUserId(); 
            insert usrCred;
        }
    }
    
    static testMethod void getCredentialsTest() {
        Map<String,String> credentialsId = new Map<String,String>(); 
        List<Credential__c> credList = [SELECT Id,name FROM Credential__c];
        for(Credential__c cred : credList){
            credentialsId.put(cred.id,cred.name);
        }
        User usrs = [select id,name from User where Email= 'puser000@amamama.com' limit 1];
        System.runAs(usrs){
            User_Credential__c credUser = [SELECT Id,name,Credential__r.name FROM User_Credential__c limit 1];
            Test.startTest();
            CredentialAssignmentController.getUserCredentials(credentialsId,usrs.Id);
            Test.stopTest();
        } 
        
    }
    static testMethod void insertCredAssignmentsTest() {
        Credential__c c = [SELECT Id,name FROM Credential__c where Name = 'Platform Developer I' limit 1];
        User usrs = [select id,name from User where Email= 'puser000@amamama.com' limit 1];
        List<CredentialAssignmentController.CredentialData>  credenlsData = new  List<CredentialAssignmentController.CredentialData>();
        CredentialAssignmentController.CredentialData newData= new CredentialAssignmentController.CredentialData();
        newData.status='';
        newData.assignedDate=system.today();
        newData.credId= c.id;
        newData.credName=c.Name;
        newData.assigneId = usrs.id;
        credenlsData.add(newData);
        System.runAs(usrs){
            Test.startTest();
            CredentialAssignmentController.insertCredAssignments(credenlsData);
            Test.stopTest();
        }   
    } 
    
}