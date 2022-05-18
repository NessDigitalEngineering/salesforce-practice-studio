public with sharing class picklistLookupController {


    @AuraEnabled(cacheable=true)
    public static List<Credential__c> getResults(String value, List<String> selectedRecId) {
        List<Credential__c> sObjectResultList = new List<Credential__c>();
        //List<User_Credential__c> userCredentialsList= [SELECT Credential__c FROM User_Credential__c where Status__c ='Completed'];
           
        //system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value+'====='+selectedRecId);
        if(selectedRecId == null)
            selectedRecId = new List<String>();

        if(String.isNotEmpty(value) && value.length() >= 3) {
            String query = 'select id,Name,Icon__c from Credential__c where Name LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId';
            system.debug(query);
            for(Credential__c so : Database.Query(query)) {
                //String fieldvalue = (String)so.get(fieldName);
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
