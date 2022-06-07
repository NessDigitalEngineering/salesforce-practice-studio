
public with sharing class CredentialAssignmentController {

    @AuraEnabled(cacheable=true)
    public static List<CredentialData> getUserCredentials(List<Id> credmap, string userId){
    
    List<CredentialData>  credenlsData = new List<CredentialData>();
    
    List<User_Credential__c> credentialsRec = [select Id,Name ,Credential__r.name,Assigned_Date__c,Due_Date__c ,Status__c,User__c from User_Credential__c where User__c =:userId];
    List<Id> lststring = new  List<Id>();
    
    for(User_Credential__c userCred:credentialsRec){

     if(userCred.Status__c != 'Assigned' && userCred.Status__c != 'Completed') {
    
    CredentialData data = new CredentialData();
    data.CredName = userCred.Credential__r.name;
    data.AssignedDate = userCred.Assigned_Date__c;
    data.DueData = userCred.Due_Date__c;
    data.Status = userCred.Status__c;
    
    credenlsData.add(data);
   
    lststring.add(userCred.Credential__r.Id);

        } 
    
    }
    List<Credential__c> credentialsRecIds = [select Id,Name from Credential__c  where Id In : credmap];

     for( Credential__c c:credentialsRecIds){
        if(!lststring.contains(c.id)) {
       
            CredentialData data =new CredentialData();
            data.CredName = c.Name;
            data.AssignedDate = System.today();
            data.DueData = System.today()+90;
            data.Status = 'Assigned';
            credenlsData.add(data);
               
               }

     }
       
     return credenlsData;
    
    }

     Public class CredentialData{
    @AuraEnabled
    public String CredName {get;set;}
    @AuraEnabled
    public Datetime AssignedDate {get;set;}
    @AuraEnabled
    public Datetime DueData {get;set;}
    @AuraEnabled
    public String Status {get;set;}
     
     }
    
    } 