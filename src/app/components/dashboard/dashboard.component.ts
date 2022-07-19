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
  filenametocreate:any;
  inc:Number = 0;
  
  
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
    this.addEditBankFb.addControl('id', new FormControl());
    this.addEditBankFb.patchValue(obj);
    var date=new Date(obj.dlcEndDt)
    
    console.log(moment(date).format(moment.HTML5_FMT.DATE))
    this.addEditBankFb.patchValue({ dlcEndDt: moment(date).format(moment.HTML5_FMT.DATE) });
    var str=this.addEditBankFb.get("imageName").value;
    
    const split_string = str.split(",");
    console.log(split_string)
    
    this.UploadedData=split_string
    var filterlast=this.UploadedData[0];
    console.log(this.UploadedData.length)
    console.log(filterlast)
   filterlast.match(`_id_${this.UploadedData.length}`)===null?
   this.inc=this.UploadedData.length+1:this.inc=1;
   console.log(this.inc)
  }
  handleCancel() {
    
    this.editable = false;
    this.addEditBankFb.reset();
    this.success=false;
  }
  async fileUploadAPI() {
    var a=this.addEditBankFb.get("sparshPpoNo").value;
    var aa=a.slice(0,3)
    var b=this.addEditBankFb.get("state").value;
    var bb=b.slice(0,3);
    var c=this.addEditBankFb.get("district").value;
    var cc=c.slice(0.3)
    this.filenametocreate=bb+"_"+cc+"_"+aa+""+this.inc;
    console.log(this.filenametocreate)
console.log(this.DocObjectArray)
   for (let index = 0; index < this.DocObjectArray.length; index = 0) {
      // this.DocObjectArray.pop();
      let lastElement1 = this.DocObjectArray.slice(-1);
   var blob = lastElement1[0].slice(0, lastElement1[0].size, lastElement1[0].type)
var newFile = new File([blob], this.filenametocreate+".txt", {type: lastElement1[0].type});
console.log(newFile)
      const formData: FormData = new FormData();
      
      formData.append('file', newFile);
      await axios
        .post('http://demo.armscert.com/api/PensionerUpload', formData)
        .then((response) => {
          console.log(response)
          this.activateUpload=false
          //console.log(response.data.dbPath);
          this.DocObjectArray.pop();
          var ExtractedURL = response.data.dbPath.replace(
            'Resources\\Images\\',
            ''
          );
          const StrtoMerge =
            'http://demo.armscert.com/Resources/Images/'.concat(ExtractedURL);
          const oldarray = [StrtoMerge];
          this.UploadedData = [...oldarray, ...this.UploadedData];
          //console.log(this.UploadedData);
          this.addEditBankFb.patchValue({ imageName: ""+this.UploadedData });
         
          // this.UploadedData.push(newArr);
          console.log(response)
          this.DocObjectArray = [];

        })
        .catch((err) => {
          console.log(err);
        });
    }
this.DocObjectArray = [];

  }
  
  onFileSelectedOriginalBG(event) {
    this.DocObjectArray = [];
    const file: File = event.target.files;
    this.inputFileUpload = file;
    this.fileLength = event.target.files.length;
    for (let index = 0; index < event.target.files.length; index++) {
      this.DocObjectArray.push(file[index]);
    }
    this.activateUpload = true;
  }
  handleBack()
  { 
    this.router.navigateByUrl('/search');
    sessionStorage.clear()
  }
}
