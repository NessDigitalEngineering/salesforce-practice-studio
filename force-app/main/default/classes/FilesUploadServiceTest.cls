@isTest(seeAllData=false)
public class FilesUploadServiceTest {
    public static testMethod void documnetsUploadTest()
 {
 user uu = TestDataFactory.createUser();
 list<Credential__c> crobj = TestDataFactory.createCredentials();
 User_Credential__c ucObj = TestDataFactory.createUserCredentials(uu.Id , crObj[0].Id);
 insert ucObj;
 Credential_Exam_Attempt__c ceaObj = new Credential_Exam_Attempt__c(User_Credential__c=ucObj.Id,
 Preparation_Comments__c='Test comments',
 Proof_of_Preparation__c=True);
 string recId = VoucherRequestController.createCredExempt(ceaObj);

 // Exam Schedule Screen Changes.
 
     ExamScheduleController.getExamDetails(recId);
     ExamScheduleController.UpdateCredExempt(ceaObj);
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

 // insert version; 
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
 VoucherRequestController.methodVRC(recId,files);

     // Exam Schedule Screen Changes.
ExamScheduleController.UploadReciept(recId,files);

 Test.stopTest();
 }
}