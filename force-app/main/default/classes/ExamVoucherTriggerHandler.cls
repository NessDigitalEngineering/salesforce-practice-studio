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
        handleEncryptService();
        ExamVoucherService.setVoucherCodeMasked(this.examVoucherNewList);
        ExamVoucherService.unsetVoucherCode(this.examVoucherNewList);
        
    }
    
    void handleEncryptService()
    {
      EncryptDecryptService service= EncryptDecryptService.getInstance();
      for(Exam_Voucher__c examVoucher:examVoucherNewList)
      {
           examVoucher.Voucher_Code_Encrypted__c=service.encryptData(examVoucher.Voucher_Code__c); 
      }
        
    }
    
}