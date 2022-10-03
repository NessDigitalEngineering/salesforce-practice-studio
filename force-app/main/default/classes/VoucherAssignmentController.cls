/**
 * @author Dipshika Nalawade
 * @date   23/09/2022
 * @description controller Class containing methods  to call service class methods Voucher Assignment
 */
public with sharing class VoucherAssignmentController {

      /*******************************************************************************************************
      * @description Returns all Exam Vouchers Available that are in progress
      * @return List of Voucher Approved
      */ 
      @AuraEnabled
      public static List<Exam_Voucher__c> getAllExamVouchers()
      { 
          try {
            VoucherAssignmentService vas = new VoucherAssignmentService();
          List<Exam_Voucher__c> totalExamVouchers = vas.getAvailableExamVouchers();
          return totalExamVouchers;  
              
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }  
      } 
}
