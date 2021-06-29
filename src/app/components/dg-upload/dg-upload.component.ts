import { Component, OnInit, Inject,Output,EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FilesComponent} from '../file/files.component'
import {RequestService} from 'src/app/services/request.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder,} from '@angular/forms';

interface ItemFile {
  idRow:string,
  fileFeature:File
}
@Component({
  selector: 'app-dg-upload',
  templateUrl: './dg-upload.component.html',
  styleUrls: ['./dg-upload.component.css']
})
export class DgUploadComponent implements OnInit {

  constructor(   
    public dialogRef: MatDialogRef<DgUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private RequestService: RequestService,
    private formBuilder: FormBuilder,
    private snack:MatSnackBar
    ) { }

  public idQuot=this.data.idQuot;
  transform:any=this.data.transform;
  idRow:any=this.data.idRowItem;
  code:string="uploader";

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getFiles();
  }
  dataFile:any;
  public getFiles(){
    this.RequestService.get('http://localhost:8080/api/Document/Quotation/'+this.idQuot)
    .subscribe(file=>{
        this.dataFile=file;
        console.log('FILE :', this.dataFile);
    })
  }
  getPDFScaned(){
    this.RequestService.getFile('http://localhost:8080/api/Document/blob/Quotation/'+this.idQuot)
    .subscribe(blob=>{
      let pdf = new Blob([blob],{type: 'application/pdf'});
      let fileData = new File([pdf], "name", {type: 'application/pdf'});
      let fileURL = window.URL.createObjectURL(fileData);
      window.open(fileURL,"_blank")
      //saveAs(blob, data?.nameDocumenQuotaion);
      })
  }
  fileName = '';
  formData = new FormData();
  onFileSelected(event) {
    const file:File = event.target.files[0];
    //console.log(file, event);
    if (file) {
      this.fileName = file.name;
      const formD = new FormData();
      formD.append("document", file);
      //console.log("formData",formD);
      this.formData=formD;
     }
  }

  quotationForm = this.formBuilder.group({
    removablefile:['',],})
  postFile(id){
    this.RequestService.post('http://localhost:8080/api/Document/'+id,this.formData).subscribe(
      {
        next:()=>{
          console.log('Archivo guardado')
          this.snack.open('Archivo agregado exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
            window.location.reload();
        },
        error:()=>{
          console.log('Archivo no guardado')
          this.snack.open('error, el archivo no se subio.','CERRAR',{duration:5000})
        },
      })
    }

    replace:boolean=false;
    disalbedInput(){
      let disabled:boolean=false;
      if(this.dataFile!=null){
        disabled=true;
      }
      if(this.replace==true){
        disabled=false;
      }
      return disabled;
    }

    deleteDoc(){
      this.RequestService.delete('http://localhost:8080/api/Document/delete/'+this.idQuot).subscribe(
      {
        next:()=>{
          
          console.log('Archivo eliminado')
          this.snack.open('Archivo eliminado','CERRAR',{duration:5000})
        },
        error:()=>{
          console.log('Archivo no eliminado')
        },
      })
     // this.getFiles();
      //this.dialogRef.close();
     // this.reopen.emit(true);
     setTimeout(() => {this.ngOnInit()}, 3000);
    }

    file:File;
    eventFileItem(event){
      this.file=event.target.files[0];
    }

/*
    json=localStorage.getItem('listFiles')
    listFiles:ItemFile[]= JSON.parse(this.json) || [];

  onFileSelected2(event){
    
    const file:File = event.target.files[0];
    console.log(file, event);
    let itemFile:ItemFile={
      idRow:this.idRow,
      fileFeature:file
    }
    if (file) {
      this.listFiles.push(itemFile);
      const jsonData = JSON.stringify(this.listFiles);
      localStorage.setItem('listFiles', jsonData);
    }
    let verify=localStorage.getItem('listFiles');
   
    console.log('listVarible',this.listFiles);
    console.log('localstorageFILES',verify);
  }


    postFilesFeatures(){
      const featureFormData=new FormData();
      
      for (let i=0;i<this.listFiles.length;i++){
        featureFormData.append("idRow", this.listFiles[i].idRow);
        featureFormData.append("document",  this.listFiles[i].fileFeature);
        console.log("formData",featureFormData);
        this.RequestService.post('http://localhost:8080/api/Document/uploadDetail',featureFormData).subscribe(
          {
            next:()=>{
              console.log('Archivo guardado'+ this.listFiles[i].idRow)
              this.snack.open('Archivo agregado exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
            },
            error:()=>{
              console.log('Archivo no guardado'+ this.listFiles[i].idRow)
              this.snack.open('error, el archivo no se subio.','CERRAR',{duration:5000})
            },
          })
      }
    }*/
    
}
