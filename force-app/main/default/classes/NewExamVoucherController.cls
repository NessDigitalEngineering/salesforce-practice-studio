public class NewExamVoucherController {

    @AuraEnabled(cacheable=true)
    public static List<Exam_Voucher__c > getVoucher(Integer limitSize, Integer offset)
    {
        List<Exam_Voucher__c> voucherReturn = new List<Exam_Voucher__c>();
        List<Exam_Voucher__c> voucherList = getQuery(limitSize, offset);
        Practice_Studio_Setting__mdt metaData = Practice_Studio_Setting__mdt.getInstance('EncryptionKeys');
        for(Exam_Voucher__c ExamVoucher : voucherList)
        {
            Blob exampleIv = Blob.valueOf(metaData.Initialization_Vector__c);
            Blob key = Crypto.generateAesKey(Integer.valueOf(metaData.Private_Key__c));
            Blob data = Blob.valueOf(ExamVoucher.Voucher_Code__c);
            Blob encrypted = Crypto.encrypt(metaData.Algorithm_Name__c, key, exampleIv, data);
            String str = String.valueOf(encrypted);
            String strData =  retVoucherData(str);
            ExamVoucher.Voucher_Code_Encrypted__c = strData;
            voucherReturn.add(ExamVoucher);
        }
        System.debug('hhats:'+voucherReturn);
        return voucherReturn;
    }
    private static String retVoucherData(String str)
    {
        String appendedData = '';
        for (integer n = 0; n < str.length(); n++) 
        {
            string x = str.subString(n,n+1);
            if (x != '*')
                x= '*';
                appendedData += x; 
        }
        return appendedData;
    }
    private static List<Exam_Voucher__c> getQuery(Integer limitSize, Integer offset)
    {
        List<Exam_Voucher__c> VoucherList = [SELECT Id,Cost__c,Invoice_Number__c,Voucher_Code__c,Expiry_Date__c,
        Voucher_Code_Encrypted__c
        FROM Exam_Voucher__c  ORDER BY CreatedDate
        LIMIT :limitSize
        OFFSET :offset];
        return VoucherList;
    }

    private static List<Exam_Voucher__c> getAllVouchers()
    {
        List<Exam_Voucher__c> VoucherList = [SELECT Id,Cost__c,Invoice_Number__c,Voucher_Code__c,Expiry_Date__c,
        Voucher_Code_Encrypted__c
        FROM Exam_Voucher__c ];
        return VoucherList;
    }

    /**************************** Decryption Logic *******************************/
    @AuraEnabled(cacheable=true)
    public static List<Exam_Voucher__c> getDecryptedData(List<Id> strId)
    {
      Set<Id> deCryptId = new Set<Id>();
      Map<Id,String> nonExistingMap = new Map<Id,String>();
      List<String> decryptList = new List<String>();
      List<Exam_Voucher__c> returnedVoucherList = getAllVouchers();
      List<Exam_Voucher__c> exmList = new List<Exam_Voucher__c>();
      List<Exam_Voucher__c> exmListOld = new List<Exam_Voucher__c>();
      String decryptedString;
      for(Id ids : strId)
      {
        deCryptId.add(ids);
      }
      
      List<Exam_Voucher__c> VoucherList = getDecryptionList(deCryptId);
        for(Exam_Voucher__c examVoucher : VoucherList)
        {
        Practice_Studio_Setting__mdt metaData = Practice_Studio_Setting__mdt.getInstance('EncryptionKeys');
        Blob exampleIv = Blob.valueOf(metaData.Initialization_Vector__c);
        Blob key = Crypto.generateAesKey(Integer.valueOf(metaData.Private_Key__c));
        Blob data = Blob.valueOf(examVoucher.Voucher_Code__c);
        Blob encrypted = Crypto.encrypt(metaData.Algorithm_Name__c, key, exampleIv, data);
        Blob decrypted = Crypto.decrypt(metaData.Algorithm_Name__c, key, exampleIv, encrypted);
        decryptedString = decrypted.toString();
        nonExistingMap.put(examVoucher.Id,decryptedString);
        }
        
      for(Exam_Voucher__c exm : VoucherList)
      {
        if(nonExistingMap.containsKey(exm.Id))
        {
            exm.Voucher_Code_Encrypted__c= nonExistingMap.get(exm.Id);
            exmList.add(exm);
          } else {
            exmListOld.add(exm);
          }
      }

      List<Exam_Voucher__c> finalResult = returnExamVoucherFinalList(exmList, exmListOld);
        return finalResult;
    
      
    }

    public static List<Exam_Voucher__c> returnExamVoucherFinalList(List<Exam_Voucher__c> newData, List<Exam_Voucher__c> oldData)
    { 
    for(Exam_Voucher__c eem : newData)
    {
        if(!oldData.contains(eem))
        {
            oldData.add(eem);
        }
    }
    return oldData;
    }
    private static List<Exam_Voucher__c> getDecryptionList(Set<Id> deCryptId)
    {
        return [SELECT Id,Cost__c,Invoice_Number__c,Voucher_Code__c,Expiry_Date__c,
        Voucher_Code_Encrypted__c
        FROM Exam_Voucher__c where id =:deCryptId];
    }
}
