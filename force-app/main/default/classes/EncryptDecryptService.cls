
/**
 * @author Trinesh Bhargava
 * @date   09/20/2022
 * @description Apex class for Encryption & Decryption Service
 */
public with sharing class EncryptDecryptService {
    public class ExamVoucherException extends Exception {}
    //private static instance of the class & variables
    private static EncryptDecryptService instance = null;   
    private String privateKey;
    private String algorithm;
    private String iv;
    private Blob blobKey;
    private Blob blobIv;
    //private constructor to avoid creating an instance
    private EncryptDecryptService()
    {
        getConfig();
        
    }
    public static EncryptDecryptService getInstance()
    {
        if(instance == null){
            instance = new EncryptDecryptService();
        }
        return instance;
    }
    /*This method encrypts the data and returns encrypted values as string 
   ********************* Encrypt Method************************************
    Param-1:Algorithm used for encryption,AES128 was used for the same.
    Param-2:Prviate key covrerted to Blob type before passing.
    Param-3:Intializaiton Vector covrerted to Blob type before passing.
    Parm-4:Actual value that needs to be passed.
    */
    public String encryptData(String value)
    {  
       Blob encryptedValue = Crypto.encrypt(algorithm, blobKey,blobIv,Blob.valueOf(value));
       String encryptedMessage=EncodingUtil.base64Encode(encryptedValue);
       return encryptedMessage;
    }
   /*This method encrypts the data and returns encrypted values as string 
   ********************* Decrypt Method************************************
    Param-1:Algorithm used for Decryption,AES128 was used for the same.
    Param-2:Prviate key covrerted to Blob type before passing.
    Param-3:Intializaiton Vector covrerted to Blob type before passing.
    Parm-4:Encrypted value that needs to be passed.
    */
    public String decryptData(String value)
    {  
       Blob encryptedValue=EncodingUtil.base64Decode(value);
       Blob decrypted = Crypto.decrypt(algorithm, blobKey, blobIv, encryptedValue);
       String decryptedString = decrypted.toString();
       return decryptedString;
    }
    /*
    This method retrives the default parameters for Encryption & Decryption that was stored
    in metdata was intialisation of data.
    */
    private void getConfig()
    {
        Practice_Studio_Setting__mdt practiceStudioSetting = Practice_Studio_Setting__mdt.getInstance('AES_128_Algorithm');
        if(practiceStudioSetting==null)
        throw new ExamVoucherException('Encryption config not defined'); 
        algorithm=practiceStudioSetting.Algorithm_Name__c;
        iv=practiceStudioSetting.Initialization_Vector__c;
        privateKey=practiceStudioSetting.Private_Key__c;
        blobIv = EncodingUtil.convertFromHex(iv);
        blobKey=EncodingUtil.convertFromHex(privateKey);

    }
    
}