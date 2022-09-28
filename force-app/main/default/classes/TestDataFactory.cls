@IsTest
public class TestDataFactory {
    public static User createUser(){
        User usr = new User(
                            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                            LastName = 'last',
                            Email = 'puser000@amamama.com',
                            Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                            CompanyName = 'TEST',
                            Title = 'title',
                            Alias = 'alias',
                            TimeZoneSidKey = 'America/Los_Angeles',
                            EmailEncodingKey = 'UTF-8',
                            LanguageLocaleKey = 'en_US',
                            LocaleSidKey = 'en_US');
        insert usr;
        return usr;
    }

    public static void assignPboAdminPermissions(User usr){
        PermissionSet ps = [SELECT Id FROM PermissionSet WHERE Name = 'Practice_Studio_Admin'];
        insert new PermissionSetAssignment(AssigneeId = usr.id, PermissionSetId = ps.Id);
    }

    public static List<Credential__c> createCredentials(){
        List<Credential__c> credLists = new List<Credential__c>{new Credential__c(            
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
                                                            US_Target__c = 2,Priority__c=1,
															
                                                            Visible_in_Partner_Community_Cert_Tab__c = true),
                                        new Credential__c(                                                           
                                                            Alias__c= 'Salesforce Certified Platform Developer II',
                                                            EU_Target__c = 3,
                                                            External_ID__c = 'Platform_Developer_I',
                                                            IN_Target__c = 4,
                                                            Icon__c = 'https://res.cloudinary.com/kolaliam/image/upload/v1650355111/Salesforce%20Badges/Platform_Developer_I_vbk3y0.png',
                                                            Name = 'Platform Developer I',
                                                            Program_Level__c = 'L2',
                                                            Registration_fee__c = 200,
                                                            Retake_fee__c = 100,
                                                            Status__c = 'Active',
                                                            Type__c = 'Trailhead',
                                                            URL__c = 'https://trailhead.salesforce.com/help?article=Salesforce-Certified-Platform-Developer-I-Exam-Guide',
                                                            US_Target__c = 2,
         
                                                            Visible_in_Partner_Community_Cert_Tab__c = true)};
                                                                
          insert credLists;                                                      
          return credLists;                                                      
                                                               
    }

    public static User_Credential__c createUserCredentials(Id userId,Id credentialId){
        return new User_Credential__c(Credential__c = credentialId,
                                        User__c = userId,
                                        Active__c = true);
    }

    public static List<Exam_Voucher__c> createExamVoucher(){
        List<Exam_Voucher__c> examVoucherList=new List<Exam_Voucher__c>();
        Exam_Voucher__c examVoucher =new Exam_Voucher__c();
        examVoucher.Voucher_Code__c='abcdefghijklmnopqrst';
        examVoucherList.add(examVoucher);
        insert examVoucherList;
        return examVoucherList;
    }


    public static List<Credential_Exam_Attempt__c> createCredentialExamAttempt(Id usrCrdId){
        List<Credential_Exam_Attempt__c> credExamAttemptLists = new List<Credential_Exam_Attempt__c>{new Credential_Exam_Attempt__c( 
                
                Exam_Date_Time__c=system.today(),
                Status__c='Voucher Assigned',
                Fail_Scorecard__c=true,
                Pass_Certificate__c=true,
                Preparation_Comments__c='prepared',
                Proof_of_Preparation__c=true,
                User_Credential__c=usrCrdId),
            new Credential_Exam_Attempt__c(
                
                Exam_Date_Time__c=system.today(),
                Status__c='Exam Scheduled',
                Fail_Scorecard__c=true,
                Pass_Certificate__c=true,
                Preparation_Comments__c='Prepared',
                Proof_of_Preparation__c=true,
                User_Credential__c=usrCrdId)};
        return credExamAttemptLists;
    }
}