/**
 * @author Dipshika Nalawade
 * @date   16/09/2022
 * @description Service Class containing methods specific to Voucher Assignment
 */
public with sharing class VoucherAssignmentService {
    /*******************************************************************************************************
     * @description This method retrieves all vouchers Admin have
     * @return List of Exam Vouchers
     */
    public List<Exam_Voucher__c> getAvailableExamVouchers(string credType, integer credentialCost) {
        try {
            return [
                SELECT id, Credential_Type__c, Name, Cost__c, Value__c, Sponsor__c, Expiry_Date__c
                FROM Exam_Voucher__c
                WHERE Credential_Type__c = :credType AND Cost__c >= :credentialCost
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception ex) {
            throw ex;
        }
    }
}
