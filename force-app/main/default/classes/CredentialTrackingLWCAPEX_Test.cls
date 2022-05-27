@isTest
public class CredentialTrackingLWCAPEX_Test {

	@testSetup 
    public static void setupmethod() {
        Credential__c cred = new Credential__c(Name='TestCred',Type__c='Trailhead',Status__c='Active',Program_Level__c='L1');
    	Insert cred;
        User_Credential__c uc = new User_Credential__c(Credential__c=cred.Id,Status__c='Assigned',User__c=userinfo.getUserId());
        insert uc;
    }
    
	@isTest
    public static void getUserCredentials(){
        List<User_Credential__c> ucList = CredentialTrackingLWCAPEX.getUserCredentials(userinfo.getUserId());
        CredentialTrackingLWCAPEX.updateUserCredential(ucList[0].Id, ucList[0].Status__c);
        System.assert(0, ucList.size());
   }
}