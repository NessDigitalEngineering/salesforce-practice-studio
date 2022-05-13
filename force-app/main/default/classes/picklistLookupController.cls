public with sharing class picklistLookupController {

   /* @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value, List<String> selectedRecId) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value+'====='+selectedRecId);
        if(selectedRecId == null)
            selectedRecId = new List<String>();

        if(String.isNotEmpty(value)) {
            String query = 'Select Id,Icon__c,'+fieldName+' FROM '+ObjectName+' WHERE '+fieldName+' LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId';
            system.debug(query);
            for(sObject so : Database.Query(query)) {
                String fieldvalue = (String)so.get(fieldName);
                sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
            }
        }
        return sObjectResultList;
    }*/

    @AuraEnabled(cacheable=true)
    public static List<Credential__c> getResults(String value, List<String> selectedRecId) {
        List<Credential__c> sObjectResultList = new List<Credential__c>();
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
    
    /*public class SObjectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
        public SObJectResult() {
          
        }
    } */
}
