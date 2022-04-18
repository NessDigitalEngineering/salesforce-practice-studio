@IsTest
private class SampleTest {
    static testMethod void doSumTest(){
        Sample s = new Sample();
        System.assertEquals(5, s.doSum(3,2), 'Test sucess scenario');
    }
}
