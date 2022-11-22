@IsTest
private class   ExamVoucherServiceTest {
    @TestSetup
    static void makeData(){
        TestDataFactory.createExamVoucher();   
        List<Credential__c> credList = TestDataFactory.createCredentials();
        User usr = TestDataFactory.createUser();
        User_Credential__c uc = TestDataFactory.createUserCredentials(usr.Id,credList[0].Id);
        insert uc;
        List<Credential_Exam_Attempt__c> credAttempts = TestDataFactory.createCredentialExamAttempt(uc.Id);
        insert credAttempts;
    }
@isTest
    private static void getExamVoucherCodeTest(){
        User usr = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usr);
        System.runAs(usr){
            Exam_Voucher__c examVoucher=[Select Voucher_Code__c,Voucher_Code_Encrypted__c from Exam_Voucher__c];     
            String decryptedMessage=   EncryptDecryptService.getInstance().decryptData(examVoucher.Voucher_Code_Encrypted__c);
            System.assertNotEquals(decryptedMessage, null);
            System.assertEquals(null, examVoucher.Voucher_Code__c);
            
        }

    }
     static testMethod void getAvailableExamVouchersTest (){
        Test.startTest();
        try {
            ExamVoucherService ces = new ExamVoucherService();
            ces.getAvailableExamVouchers('trailhead', 400);
        } catch (Exception ex) {
            system.assert(ex.getMessage().contains('Insufficient permissions'));
        }   
        Test.stopTest();
    }

    @isTest
    private static void sendAssignedEmailTest(){
        Credential_Exam_Attempt__c credAttempt = [Select id from Credential_Exam_Attempt__c][0];
        Exam_Voucher__c voucher = TestDataFactory.getExamVoucher();
        insert voucher;
        Exam_Voucher__c voucherToUpdate = new Exam_Voucher__c(Id = voucher.Id,
                                                                Credential_Exam_Attempt__c = credAttempt.Id,
                                                                Status__c = 'Assigned');
        update voucherToUpdate;
        System.assertEquals(1, Limits.getEmailInvocations(), 'Emails should be sent');
    }
}