public class CredentialsOfSubordinatesAPEX {
@AuraEnabled
   public static map<user,List<User_Credential__c>> getCredentialsOfSubordinates(String userId)
   {
       map<user,List<User_Credential__c>> resp = new map<user,List<User_Credential__c>>();       
       map<id,List<User_Credential__c>> respWithIds = new map<id,List<User_Credential__c>>();
       UserCredentialService u = new UserCredentialService();
       Map<Id, User> um = new Map<Id, User>(u.getSubordinates(userId));
       List<User_Credential__c> ucl=u.getActiveUserCredentials( new List<Id>(um.keySet()));
       System.debug('ucl='+ucl); 
       for(User_Credential__c uc:ucl){
           if(respWithIds.get(uc.User__c)!=null){
               respWithIds.get(uc.User__c).add(uc);
           } else{
               respWithIds.put(uc.User__c, new List<User_Credential__c>{uc});
           }
       }
       System.debug('respWithIds='+respWithIds);
       for(id usrId:respWithIds.keySet()){
           resp.put(um.get(usrId), respWithIds.get(usrId));
       }
       System.debug('resp='+resp); 
       return resp;
   }
    
}