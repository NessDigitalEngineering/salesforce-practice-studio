public class ExamVoucherTriggerHandler extends TriggerHandler {
    
    private Map<Id, Exam_Voucher__c> examVoucherNewMap;
    private Map<Id, Exam_Voucher__c> examVoucherOldMap;
    private list<Exam_Voucher__c> examVoucherNewList;
    private list<Exam_Voucher__c> examVoucherOldList;
    public ExamVoucherTriggerHandler()
    {
        this.examVoucherNewList = (List<Exam_Voucher__c>) Trigger.New;
    }
    public override void beforeInsert() 
    {   
        ExamVoucherService.handleEncryptService(this.examVoucherNewList);
        ExamVoucherService.setVoucherCodeMasked(this.examVoucherNewList);
        ExamVoucherService.unsetVoucherCode(this.examVoucherNewList);
        
    }
    
    
    
}