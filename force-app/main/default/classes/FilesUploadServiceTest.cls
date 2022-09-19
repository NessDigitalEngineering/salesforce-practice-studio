@isTest(seeAllData=false)
public class FilesUploadServiceTest {
    public static testMethod void documnetsUploadTest()
    {
          Profile pf= [Select Id from profile where Name='System Administrator']; 
        String orgId=UserInfo.getOrganizationId(); 
        String dateString=String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','') ;
        Integer randId=Integer.valueOf(Math.rint(Math.random()*1000000)); 
        String uniqueName=orgId+dateString+randId; 
        User uu=new User(firstname = 'ABC', 
                         lastName = 'XYZ', 
                         email = uniqueName + '@test' + orgId + '.org', 
                         Username = uniqueName + '@test' + orgId + '.org', 
                         EmailEncodingKey = 'ISO-8859-1', 
                         Alias = uniqueName.substring(18, 23), 
                         TimeZoneSidKey = 'America/Los_Angeles', 
                         LocaleSidKey = 'en_US', 
                         LanguageLocaleKey = 'en_US', 
                         ProfileId = pf.Id
                        ); 
        insert uu;

        
        Credential__c crObj = new Credential__c(Name='Service Cloud Consultant',
                                                Type__c='Trailhead',
                                                Status__c='Active',
                                                Program_Level__c='L1',
                                                Visible_in_Partner_Community_Cert_Tab__c=True
                                               );
        insert crObj;
        User_Credential__c ucObj = new User_Credential__c(Credential__c =crObj.id,
                                                          User__c =uu.id,
                                                          Status__c='Ready'
                                                         );
      
        
        
        
          insert ucObj;
        Credential_Exam_Attempt__c ceaObj = new Credential_Exam_Attempt__c(User_Credential__c=ucObj.Id,
                                                                           Preparation_Comments__c='Test comments',
                    
                                                                           
                                                                         Proof_of_Preparation__c=True);
        
        string recId = VoucherRequestController.createCredExempt(ceaObj);
        Account testAccount = new Account();
        testAccount.Name='Test Account' ;
        insert testAccount;
        
        Contact cont = new Contact ();
        cont.FirstName = 'FirstName';
        cont.LastName = 'LastName';
        cont.Email='email@email.com';
        cont.phone='12345678';
        insert cont;
        
        Account acct = new Account(Name='TEST_ACCT');
        insert acct;
        List<contentVersion> version = new List<contentVersion>();
        List<map<string,object>> vers = new List<map<string,object>>();
        ContentVersion contentVersion = new ContentVersion(
            Title = 'Penguins',
            PathOnClient = 'Penguins.jpg',
            VersionData = Blob.valueOf('Test Content'),
            IsMajorVersion = true
        );
        version.add(contentVersion);
        database.insert(version);
        
         
        string before = 'Testing encoding record';
        Blob beforeblob = Blob.valueOf(before);
        string paramvalue = EncodingUtil.base64Encode(beforeblob);        
        Map<String,Object> mapContent = new Map<String,Object>{ 'fileContent' => paramvalue , 'fileName' => 'Test'};
       
        
            List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        vers.add(mapContent);
         
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = acct.id;
        cdl.ContentDocumentId = documents[0].Id;
        cdl.shareType = 'V';
        insert cdl;
        
       
        Test.startTest();
     FilesUploadService.FileDataWP obj = new FilesUploadService.FileDataWP();
        obj.fileContent = paramvalue;
        obj.fileName = 'test';
        
        list<FilesUploadService.FileDataWP> filelist = new list<FilesUploadService.FileDataWP>();
        
        filelist.add(obj);
        string file = json.serialize(filelist);
     
        list<string> files = new list<string>();
        files.add(file);
            
    	 FilesUploadService.uploadFiles(recId, files);
          Test.stopTest();
    }
    
    
}