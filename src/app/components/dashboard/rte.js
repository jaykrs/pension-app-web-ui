import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import axios from 'axios';
import { Pensioner } from './form.modal';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeAddExpenseModal1', { static: false })
  closeAddExpenseModal: ElementRef;

  dataFetch: any;
  editable: Boolean = false;
  bankObject: Pensioner[] = [];
  addEditBankFb: FormGroup;
  UploadedData = [];
  inputFileType: string = null;
  inputFileUpload: File;
  fileLength: Number;
  DocObjectArray = [];
  activateUpload: Boolean = false;
  success:Boolean = false;
  loader:Boolean = false;
  constructor(private fb: FormBuilder,private router: Router) {
    this.addEditBankFb = this.fb.group({
      sparshPpoNo: new FormControl('', [Validators.required]),
      pensionerName: new FormControl('', [Validators.required]),
      service: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      // ,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
      mobile: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      village: new FormControl('', [Validators.required]),
      postOffice: new FormControl('', [Validators.required]),
      tehsil: new FormControl('', [Validators.required]),
      pin: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      remarks: new FormControl('', [Validators.required]),
      aadhar: new FormControl('', [Validators.required]),
      dlcEndDt: new FormControl('', [Validators.required]),
      imageName: new FormControl(''),
    });
  }

  ngOnInit(): void {
    var abc = JSON.parse(sessionStorage.getItem('PData'));
    this.dataFetch = abc;
    //console.log(this.dataFetch);
  }
  submit(payload: Pensioner) {
    //console.log(payload);
    axios
      .post('http://demo.armscert.com/api​/Pensioner​/InsertPensioner', payload)
      .then((response) => {
        //console.log(response);
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  update(payload: Pensioner) {
    this.loader=true;
    var cdt = moment(payload.dlcEndDt).format('YYYY-MM-DD HH:mm');
    console.log(cdt)
    //console.log(""+this.UploadedData)
    
    // this.addEditBankFb.get("imageName").setValue(address);
    console.log(payload);
    axios
      .put('http://demo.armscert.com/api/Pensioner/UpdatePensioner', payload)
      .then((response) => {
        axios
          .get(
            `http://demo.armscert.com/api/Pensioner/GetPensionerByStateDistrict?State=${payload.state}&District=${payload.district}`
          )
          .then((response) => {
            sessionStorage.setItem('PData', JSON.stringify(response.data));
            this.dataFetch = JSON.parse(sessionStorage.getItem('PData'));
            // window.location.reload();
            this.closeAddExpenseModal.nativeElement.click();
            this.loader=false;
            this.DocObjectArray = [];
          })
          .catch((error) => {
            //console.log(error);
          });
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  edit(obj: Pensioner) {
    this.editable = true;
    //console.log(obj);
    this.addEditBankFb.addControl('id', new FormControl());
    this.addEditBankFb.patchValue(obj);
    var date=new Date(obj.dlcEndDt)
    
    console.log(moment(date).format(moment.HTML5_FMT.DATE))
    this.addEditBankFb.patchValue({ dlcEndDt: moment(date).format(moment.HTML5_FMT.DATE) });
    var str=this.addEditBankFb.get("imageName").value;
    const split_string = str.split(",");
    console.log(split_string)
    this.UploadedData=split_string
  }
  handleCancel() {
    
    this.editable = false;
    this.addEditBankFb.reset();
    this.success=false;
  }
  async fileUploadAPI() {
    console.log(this.DocObjectArray);
this.success=true;
    // let lastElement1 = arry.slice(-1);

    for (let index = 0; index < this.DocObjectArray.length; index = 0) {
      // this.DocObjectArray.pop();
      let lastElement1 = this.DocObjectArray.slice(-1);
      const formData: FormData = new FormData();
      formData.append('file', lastElement1[0]);
      await axios
        .post('http://demo.armscert.com/api/PensionerUpload', formData)
        .then((response) => {
          // this.activateUpload=false
          // //console.log(response.data.dbPath);
          // this.DocObjectArray.pop();
          // var ExtractedURL = response.data.dbPath.replace(
          //   'Resources\\Images\\',
          //   ''
          // );
          // const StrtoMerge =
          //   'http://demo.armscert.com/Resources/Images/'.concat(ExtractedURL);
          // const oldarray = [StrtoMerge];
          // this.UploadedData = [...oldarray, ...this.UploadedData];
          // //console.log(this.UploadedData);
          // this.addEditBankFb.patchValue({ imageName: ""+this.UploadedData });
          //console.log(this.addEditBankFb)
          // this.UploadedData.push(newArr);
          console.log(response)
          this.DocObjectArray = [];

        })
        .catch((err) => {
          console.log(err);
        });
    }
    //console.log(this.UploadedData);
  }
  
  onFileSelectedOriginalBG(event) {
    this.DocObjectArray = [];
    const file: File = event.target.files;
    this.inputFileUpload = file;
    this.fileLength = event.target.files.length;
    //console.log(file);
    for (let index = 0; index < event.target.files.length; index++) {
      // var blob=file[index].slice(0,file[index].size,file[index].type.length);
      // var newFile=new File([blob],await this.GetFileID()+file[index].type,{type:file[index].type})
      // //console.log(newFile)
      this.DocObjectArray.push(file[index]);
      // //console.log(this.DocObjectArray)
      // this.fileUploadAPI();
    }
    this.activateUpload = true;

    //   // //console.log(this.fileLength)
    //   // this.inputFileType = "OriginalBG";
    // // //console.log(id)
  }
  handleBack()
  { 
    this.router.navigateByUrl('/search');
    sessionStorage.clear()
  }
}
