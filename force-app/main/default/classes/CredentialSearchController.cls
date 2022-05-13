public  class CredentialSearchController {
  
    @AuraEnabled(cacheable=true)
    public static List <Credential__c> getCredentials(String searchKeyWord) {
     String searchKey = searchKeyWord + '%';
     List <Credential__c> returnCredentials = new List <Credential__c> ();
     List <Credential__c> lstOfCredentials = [select id,Name,Icon__c from Credential__c where Name LIKE: searchKey];
    
     for (Credential__c credentials: lstOfCredentials) {
        returnCredentials.add(credentials);
       
        }
     return returnCredentials;
    } 

    @AuraEnabled(cacheable=true)
    public static List <Credential__c> getCredName() {
         return [select id,Name,Icon__c from Credential__c];
        
    }
}