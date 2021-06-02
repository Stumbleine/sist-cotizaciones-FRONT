import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FilesComponent} from '../file/files.component'
import {RequestService} from 'src/app/services/request.service'
@Component({
  selector: 'app-dg-upload',
  templateUrl: './dg-upload.component.html',
  styleUrls: ['./dg-upload.component.css']
})
export class DgUploadComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<DgUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private RequestService: RequestService,) { }

  public idQuot=this.data.idQuot;
  code:string="uploader";

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
    console.log(file, event);
    if (file) {
      
      this.fileName = file.name;

      const formD = new FormData();
      formD.append("hey","asd");
      formD.append("document", file);
      console.log("formData",formD);
      this.formData=formD;

     }

  }

  postFile(id){
    this.RequestService.post('http://localhost:8080/api/Document/'+id,this.formData).subscribe(
      {
        next(){
          console.log('Archivo guardado')
          
        },
        error(){
          console.log('Archivo no guardado')
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
        next(){
          
          console.log('Archivo eliminado')
          
        },
        error(){
          console.log('Archivo no eliminado')
        },
      })
      this.getFiles();
      this.dialogRef.close();
      

    }
    
}
