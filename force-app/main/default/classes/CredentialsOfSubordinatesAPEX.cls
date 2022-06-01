public class CredentialsOfSubordinatesAPEX {
    
	@AuraEnabled(cacheable=true)    
   public static List<subordinateCredentialsInfo> getCredentialsOfSubordinates(String userId){      
       List<subordinateCredentialsInfo> sciList = new List<subordinateCredentialsInfo>();
       map<id,List<User_Credential__c>> usrIdUcMap = new map<id,List<User_Credential__c>>();
       UserCredentialService u = new UserCredentialService();
       Map<Id, User> um = new Map<Id, User>(u.getSubordinates(userId));
       List<User_Credential__c> ucl=u.getActiveUserCredentials( new List<Id>(um.keySet()));
       System.debug('ucl='+ucl); 
       for(User_Credential__c uc:ucl){
           if(usrIdUcMap.get(uc.User__c)!=null){
               usrIdUcMap.get(uc.User__c).add(uc);
           } else{
               usrIdUcMap.put(uc.User__c, new List<User_Credential__c>{uc});
           }
       }
       for(id usrId:usrIdUcMap.keySet()){
          subordinateCredentialsInfo sci =new subordinateCredentialsInfo();
           sci.usrRecordId=usrId;
           sci.usrRecord= um.get(usrId);
           sci.ucList= usrIdUcMap.get(usrId);
           sciList.add(sci);
       }
      	System.debug('sciList='+sciList);
       return sciList;
   }
    
public class subordinateCredentialsInfo{
        @AuraEnabled
        public Id usrRecordId{get;set;}
    	@AuraEnabled
        public User usrRecord{get;set;}
        @AuraEnabled
        public List<User_Credential__c> ucList{get;set;}
    }    
}