import { LightningElement ,track } from 'lwc';
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import voucher_Assignment from "@salesforce/label/c.voucher_Assignment";
export default class VoucherAssignment extends LightningElement {
    @track countRec;
    @track showIcon = false;
    Icn = TasksIcon;
    @track emptyRecords = true;
    label = {
		ExamAttempt_EmptyMsg,
        voucher_Assignment
	};

    connectedCallback() {
        // this.countRec = res.length;
        // if (res.length === 0) {
        //     this.showIcon = true;
        //     this.emptyRecords = false;
        // }
        if (this.countRec > 0) {
            this.title = this.label.voucher_Assignment + " (" + res.length + ")";
        } else {
            this.title = this.label.voucher_Assignment;
        }
    }
}