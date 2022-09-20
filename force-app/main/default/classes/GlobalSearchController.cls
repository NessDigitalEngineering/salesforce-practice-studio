public with sharing class GlobalSearchController {
    
    @AuraEnabled(cacheable=true)
    public static List<List<SObject>> globalSrch(string srchValue){
        List<List<SObject>> sobjLst = [FIND :srchValue IN ALL FIELDS RETURNING Account (Id, Name, AccountNumber, Website), Contact(Id, Name, Email, MobilePhone), Opportunity(Id, Name, StageName, CloseDate), Lead(Id, Name, Email, Company)];
        return sobjLst;
    }

}