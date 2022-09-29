@isTest
public class MultiRecordsApprovalControllerTest {
  public static testMethod void method1(){
     MultiRecordsApprovalController.SubmittedRecordsWrapper mst = new MultiRecordsApprovalController.SubmittedRecordsWrapper();
      
              Credential__c cred =      new Credential__c(            
            Alias__c= 'Salesforce Certified Platform Developer II',
            EU_Target__c = 3,
            External_ID__c = 'Platform_Developer_II',
            IN_Target__c = 4,
            Icon__c = 'https://res.cloudinary.com/kolaliam/image/upload/v1650355111/Salesforce%20Badges/Platform_Developer_II_mecgf5.png',
            Name = 'Platform Developer II',
            Program_Level__c = 'L3',
            
            Registration_fee__c = 200,
            Retake_fee__c = 100,
            Status__c = 'Active',
            Type__c = 'Trailhead',
            URL__c = 'https://trailhead.salesforce.com/help?article=Salesforce-Certified-Platform-Developer-II-Exam-Guide',
            US_Target__c = 2,
            Visible_in_Partner_Community_Cert_Tab__c = true);
        insert cred;
     
        User_Credential__c uc = testDataFactory.createUserCredentials(userInfo.getUserId(), cred.Id);
        insert uc;
        
        
        Credential_Exam_Attempt__c exam = new Credential_Exam_Attempt__c(
            
            Exam_Date_Time__c=system.today(),
            Status__c='Voucher Requested',
            Fail_Scorecard__c=true,
            Pass_Certificate__c=true,
            Preparation_Comments__c='prepared',
            Proof_of_Preparation__c=true,
            User_Credential__c=uc.Id);
            insert exam;
         User user1 = [SELECT Id FROM User WHERE Profile.Name='System administrator' limit 1];

  /*      Approval.ProcessSubmitRequest req =     new Approval.ProcessSubmitRequest();
      req.setComments('Submitting request for approval via form');
      req.setObjectId(exam.Id);
     
      //Step 3:  Submit on behalf of a specific submitter
      req.setSubmitterId(UserInfo.getUserId()); 
   
      //Step 4:  Submit the record to specific process and skip the criteria evaluation
      req.setProcessDefinitionNameOrId('Test_Approval');
      req.setSkipEntryCriteria(true);

      //Step 5:  Submit the approval request for the bid
      Approval.ProcessResult result = Approval.process(req);
*/
      

        Integer intvar = MultiRecordsApprovalController.gettotalcount();
       List<MultiRecordsApprovalController.SubmittedRecordsWrapper> prorec = new List<MultiRecordsApprovalController.SubmittedRecordsWrapper>();
        prorec = MultiRecordsApprovalController.getSubmittedRecords(5,0);
        string resultrec = MultiRecordsApprovalController.processRecords('Approve',Json.serialize(prorec));
      MultiRecordsApprovalController.getObjectName(exam.Id);
      MultiRecordsApprovalController.IncreaseCoverage();
    }
    
}