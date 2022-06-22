/**
* @author Maddileti Boya
* @date   6/22/2022
* @description Service Class containing methods specific to CredentialAssignment user story
*/
public with sharing class CredentialAssignmentController {

    public CredentialAssignmentController(){

    }
    /*******************************************************************************************************
    * @description Returns CredentialData that are based on user selection    
    * @param credmap and userId of wrapper class.
    * @return List of CredentialData 
    */ 

    @AuraEnabled(cacheable=true)
    public static List<CredentialData> getUserCredentials(Map<String,String> credmap, string userId){
    
    List<CredentialData>  credenlsData = new List<CredentialData>();
    List<CredentialData>  credenlsData2 = new List<CredentialData>();
    
    UserCredentialService usCredService = new UserCredentialService ();

    List<User_Credential__c> credentialsRec = usCredService.getActiveUserCredentials(userId); 
    List<Id> lststring = new  List<Id>();
    
    for(User_Credential__c userCred:credentialsRec){
    
    if(userCred.Status__c != 'Completed') {
    
    CredentialData data = new CredentialData();
    data.CredName = userCred.Credential__r.name;
    data.AssignedDate = userCred.Assigned_Date__c;
    data.DueData = userCred.Due_Date__c;
    data.Status = userCred.Status__c;
    data.deleteIcon=false;     
    
    credenlsData.add(data);
    
    lststring.add(userCred.Credential__r.Id);
    
    } 
    
    }
    
    date latestDate;  
    
    for( String c:credmap.keySet()){
    
    if(!lststring.contains(c)) {
        CredentialData data =new CredentialData();
        data.credName = credmap.get(c);
        data.assignedDate = System.today();
        data.status = '';
        data.assigneId=userId;
        data.credId=c;
        credenlsData2.add(data);
    
        if(credenlsData2.size() == 1){
            if(credenlsData.size() > 0){
                integer x = credenlsData.size();
                data.dueData = credenlsData[x-1].dueData+90;
                      latestDate = Date.valueOf(credenlsData[x-1].dueData)+90;
            }else{
                data.dueData = System.today()+90;
                      latestDate = System.today()+90;
            }
        }
        else{           
            data.dueData = latestDate + 90;
            latestDate =  latestDate + 90;
        }
        credenlsData.add(data);
  
            }
    
    }
    
    return credenlsData;
    
    }
    /*******************************************************************************************************
    * @description Inserting credentials data that are based on credentials selection      
    * @param credAssignmentList of wrapper class
    */ 
    @AuraEnabled
    public static void insertCredAssignments(List<CredentialData> credAssignmentList)
    {    
    UserCredentialService credentialService=new UserCredentialService();
    List<User_Credential__c> userCredentials=new List<User_Credential__c>();
    for(CredentialData credData:credAssignmentList)
    {
    if(String.isBlank(credData.status)){
    User_Credential__c userCred=new User_Credential__c();
    userCred.Credential__c=credData.credId;
    userCred.Assigned_Date__c=credData.assignedDate;
    userCred.Due_Date__c=credData.dueData;
    userCred.User__c=credData.assigneId;
    userCred.Status__c='Assigned';
    userCred.Assigned_By__c=UserInfo.getUserId();
    userCredentials.add(userCred);
    } 
    }
    credentialService.createUserCredentials(userCredentials);
    
    }
    public class CredentialData{

        public CredentialData() {

        }

    @AuraEnabled
    public String credId{get;set;}    
    @AuraEnabled
    public String credName {get;set;}
    @AuraEnabled
    public Datetime assignedDate {get;set;}
    @AuraEnabled
    public Datetime dueData {get;set;}
    @AuraEnabled
    public String status {get;set;}
    @AuraEnabled
    public String assigneId {get;set;}
    @AuraEnabled
    public Boolean deleteIcon {get;set;}
    }
    
    }    