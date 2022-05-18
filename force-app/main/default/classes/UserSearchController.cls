public with sharing class UserSearchController {
   
    @AuraEnabled(cacheable=true)
    public static List <User> getUsers(String searchKeyWord) {
     String searchKey = searchKeyWord + '%';
     List <User> returnList = new List < User > ();
    
    if(String.isNotEmpty(searchKey) && searchKey.length() >= 4) {
        List <User> lstOfUsers = [select id, Name,Title from User where Name LIKE: searchKey];
     for (User users: lstOfUsers) {
        returnList.add(users);
       
        }
    } 
     return returnList;
    } 
}