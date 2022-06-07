@isTest
public class CredentialsUnAssignedReportTest {
    
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
        uc.User__c = '0051y00000Lcb0KAAR';
        
        insert uc;
        User_Credential__c uc1 = new User_Credential__c ();
        uc1.Credential__c =c2.id;
        uc1.status__c = 'Completed';
        
        insert uc1;
        
    }
    static testMethod void getunAssignedCredentialsTest() {
        
        User_Credential__c c = [SELECT Id,user__c FROM User_Credential__c where status__c = 'Completed' limit 1];
         system.debug('c111 user name '+c.User__c);
        String userId;
        
        Test.startTest();
           CredentialsUnAssignedReport.getUnassignedReport(userId);
        Test.stopTest();
        
    }

} 