public  class CredentialSearchController {
  
        @AuraEnabled(cacheable=true)
        public static List<Credential__c> getCredentials(String value, List<String> selectedRecId) {
            List<Credential__c> sObjectResultList = new List<Credential__c>();
           
            if(selectedRecId == null)
                selectedRecId = new List<String>();
    
            if(String.isNotEmpty(value) && value.length() >= 3) {
                String query = 'select id,Name,Icon__c,(SELECT Name FROM User_Credentials__r) from Credential__c where Name LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId';
                system.debug(query);
                for(Credential__c so : Database.Query(query)) {
                    
                    sObjectResultList.add(so);
                }
            }
            return sObjectResultList;
        }
    
       @AuraEnabled(cacheable=true)
        public static List<Credential__c>  selectedcredentials(list<string> credentialsId){
            List<Credential__c> credentialsRec = [select id,Name,Icon__c from Credential__c where Id IN:credentialsId];
            return credentialsRec;
        } 
         
}