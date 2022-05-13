public with sharing class apecExample1 {
    

    @AuraEnabled(cacheable=true)
    public static List <User> getResults(String searchKeyWord) {
     String searchKey = searchKeyWord + '%';
     List <User> returnList = new List < User > ();
     List <User> lstOfUsers = [select id, Name,UserRole.Name,Title from User where Name LIKE: searchKey];
    
     for (User users: lstOfUsers) {
        returnList.add(users);
       
        }
     return returnList;
    }

    @AuraEnabled(cacheable=true)
    public static List <User_Credential__c> getCredentials(String searchKeyWord) {
     String searchKey = searchKeyWord + '%';
     List <User_Credential__c> returnCredentials = new List <User_Credential__c> ();
     List <User_Credential__c> lstOfUsers = [select id,Name, Badge_Icon__c,Credential__r.name from User_Credential__c where Name LIKE: searchKey];
    
     for (User_Credential__c credentials: lstOfUsers) {
        returnCredentials.add(credentials);
       
        }
     return returnCredentials;
    }
    
   
}