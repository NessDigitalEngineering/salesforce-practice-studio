public with sharing class CredentialSearchController {
  
    @AuraEnabled(cacheable=true)
    public static List<Credential__c> getCredentials(String searchKey, List<String> selectedRecId,Id userId) {
        List<Credential__c> sObjectResultList = new List<Credential__c>();
          
        
        if(selectedRecId == null)
            selectedRecId = new List<String>();
    
        if(String.isNotEmpty(searchKey) && searchKey.length() >= 3) {
            String query = 'select id,Name,Icon__c,(SELECT Name,Status__c,User__r.id FROM User_Credentials__r) from Credential__c where Name LIKE \'%' + searchKey.trim() + '%\' and ID NOT IN: selectedRecId WITH SECURITY_ENFORCED';
            system.debug(query);
            for(Credential__c so : Database.Query(query)) {
    
                for(User_Credential__c usCds: so.User_Credentials__r){
    
                    if(usCds.Status__c != 'Completed' && usCds.User__r.id == userId){
                        
                        sObjectResultList.add(so);
                    
                    }
                        
                    } 
            }
        }
        return sObjectResultList;
    } 
          
}