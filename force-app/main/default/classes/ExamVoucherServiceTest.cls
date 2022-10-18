@IsTest
private class   ExamVoucherServiceTest {
    @TestSetup
    static void makeData(){
        TestDataFactory.createExamVoucher();        
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
}