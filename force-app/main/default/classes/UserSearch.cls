public with sharing class UserSearch {

    @AuraEnabled(cacheable=true)
    public static List <User> getUsers(String name) {
     String searchKey = name + '%';
     List <User> returnList = new List < User > ();
     List <User> lstOfUsers = [select id, Name from User where Name LIKE: searchKey];
    
     for (User users: lstOfUsers) {
        returnList.add(users);
        }
     return returnList;
    } 
}