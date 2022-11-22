public class ExamVoucherTriggerHandler extends TriggerHandler {
    private Map<Id, Exam_Voucher__c> examVoucherNewMap;
    private Map<Id, Exam_Voucher__c> examVoucherOldMap;
    private list<Exam_Voucher__c> examVoucherNewList;
    private list<Exam_Voucher__c> examVoucherOldList;
    public ExamVoucherTriggerHandler() {
        this.examVoucherNewList = (List<Exam_Voucher__c>) Trigger.New;
        this.examVoucherNewMap = (Map<Id, Exam_Voucher__c>) Trigger.NewMap;
        this.examVoucherOldMap = (Map<Id, Exam_Voucher__c>) Trigger.OldMap;
    }
    public override void beforeInsert() {
        ExamVoucherService.encryptVoucherCode(this.examVoucherNewList);
        ExamVoucherService.maskVoucherCode(this.examVoucherNewList);
        ExamVoucherService.unsetVoucherCode(this.examVoucherNewList);
    }

    public override void afterUpdate() {
        List<Exam_Voucher__c> voucherList = new List<Exam_Voucher__c>();
        Set<String> examAttemptIdSet = new Set<String>();
        for (Id i : this.examVoucherNewMap.keySet()) {
            if (
                examVoucherNewMap.get(i).Status__c != examVoucherOldMap.get(i).Status__c &&
                examVoucherNewMap.get(i).Status__c == 'Assigned'
            ) {
                voucherList.add(this.examVoucherNewMap.get(i));
                examAttemptIdSet.add(examVoucherNewMap.get(i).Credential_Exam_Attempt__c);
            }
        }
        if (!voucherList.isEmpty()) {
            new ExamVoucherService().sendAssignedEmail(voucherList, examAttemptIdSet);
        }
    }
}
