import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const MAX_FILE_SIZE = 50000000;

export default class FileUploadMultiLWC extends LightningElement {
  @api examid;
  @api credname;
  @api isfile;
  @api isvopened;
  @api examresult;
  @track filesData = [];
  showSpinner = false;

  handleFileUploaded(event) {
    let rand = this.getRandomArbitrary();
    console.log("rand:", rand);
    console.log("voucher request:", this.isvopened);
    if (event.target.files.length > 0) {
      for (let x of event.target.files) {
        if (x.size > MAX_FILE_SIZE) {
          this.showToast(
            "Error!",
            "error",
            "File size exceeded the upload size limit."
          );
          return;
        }
        let file = x;
        console.log("FIle:", file);
        let reader = new FileReader();
        reader.onload = (e) => {
          let fileContents = reader.result.split(",")[1];

          if (this.isfile) {
            this.filesData.push({
              fileName:
                this.examid +
                "_" +
                this.credname +
                "_" +
                rand +
                "_Receipt" +
                ".pdf",
              fileContent: fileContents
            });
          } else if (this.isvopened) {
            this.filesData.push({
              fileName: this.credname + "_" + file.name,
              fileContent: fileContents
            });
          } else {
            this.filesData.push({
              fileName:
                this.examid +
                "_" +
                this.credname +
                "_" +
                "Exam Result" +
                ".pdf",
              fileContent: fileContents
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }

    const selectEvent = new CustomEvent("upload", {
      detail: this.filesData
    });
    this.dispatchEvent(selectEvent);
  }

  removeReceiptImage(event) {
    let index = event.currentTarget.dataset.id;
    this.filesData.splice(index, 1);
  }

  showToast(title, variant, message) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        variant: variant,
        message: message
      })
    );
  }

  @api checkValidity() {
    try {
      console.log("inside functionss");
      const allValid1value = this.template.querySelector(".fup").value;
      const allValid1 = this.template.querySelector(".fup");
      if (!allValid1value) {
        allValid1.setCustomValidity("This Field is Required");
        allValid1.reportValidity();
        return true;
      } else {
        console.log("pass");
        return false;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  getRandomArbitrary() {
    const myArray = new Uint16Array(1);
    let text = "";
    crypto.getRandomValues(myArray);

    for (const num of myArray) {
      text += num + "<br>";
    }
    return text;
  }
}
