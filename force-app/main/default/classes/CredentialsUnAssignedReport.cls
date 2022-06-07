public with sharing class CredentialsUnAssignedReport {
    
    @AuraEnabled(cacheable=true)
    public static List<UnassignedWrapper> getUnassignedReport(String userId){
        List<UnassignedWrapper> credUser = new List<UnassignedWrapper>();
        set<Id> credUserUnassigned = new set<Id>();
        system.debug('credUserUnassigned.size() '+credUserUnassigned.size());
        List<user> usrLst = [select id,Name,(select id, user__c,Status__c,Completion_Date__c from User_Credentials__r 
        ORDER BY Completion_Date__c DESC limit 1) from user where managerid =: userId];

for(user u : usrLst){
    if(u.User_Credentials__r.size() > 0){
        for(User_Credential__c uc : u.User_Credentials__r){
            system.debug('uc.Status__c '+uc.Status__c);
            if(uc.Status__c.contains('Assigned') || uc.Status__c.contains('Ready') || uc.Status__c.contains('Preparing')){

                 credUserUnassigned.add(uc.user__c);
                 system.debug('credUserUnassigned '+credUserUnassigned);
                 
            }else{
                system.debug('credUserUnassigned '+credUserUnassigned);
                
                if(!credUserUnassigned.contains(u.Id)){
                    UnassignedWrapper uW = new UnassignedWrapper();
                    uW.completionDate = uc.Completion_Date__c.format();
                    uW.uname = u.Name;
                    credUser.add(uw);
                }
            }
        }
    }else{
        UnassignedWrapper uW = new UnassignedWrapper();
        uW.completionDate = null;
        uW.uname = u.Name;
        credUser.add(uW);
    }

    }
        return credUser;
    }
    
    public class UnassignedWrapper{
        @AuraEnabled
        public string uname;

        @AuraEnabled
        public String completionDate;
    }
}

