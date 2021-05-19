import { Component, OnInit,Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';

 interface business{
  nameBusiness:string;
  subtotal:number;
}
 interface itemChart{
  idPriceQuotationDetail:number;
  quantity:number;
  unit:string;
  description:string;
  quotationBusiness:business[];
}
@Component({
  selector: 'app-comparative-chart',
  templateUrl: './comparative-chart.component.html',
  styleUrls: ['./comparative-chart.component.css']
})
export class ComparativeChartComponent implements OnInit {
  @Input()quotationsCompleted:any;
  @Input()status:any;
  @Input()pressedNew:any;
  constructor(
    private RequestService: RequestService,private rutaActiva: ActivatedRoute
  ) { }
  displayedColumns: string[] = [ 'quantity', 'unit', 'description'];
  
  displayedColumnsBusiness: string[] = [];
  dataSourceBusiness =  new MatTableDataSource<any>([]);
  
  public reqReceived:any;
  public idReqSpending:any;
  public detailsQuotation:any=[];
  public comparativeChart:any[]=[];
  public sizeDetails=0;
  public  businessList:any[]=[];
  public nuevaTabla:any[]=[];
  public comparativeChart2:itemChart[];
  public comparativeChartSend:any[]=[]
  quotatioBusiness:any[]
 
  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadDataChart(this.idReqSpending);
    console.log(this.status)
    
  }
  refresh() {
  this.displayedColumnsBusiness=this.displayedColumns.concat(this.quotationsCompleted.map(x=>x.nameBussiness))
   this.dataSourceBusiness.data = this.comparativeChart;
   console.log(this.comparativeChartSend)
   
} 
  
  loadDataChart(id:any){
    this.RequestService.get('http://localhost:8080/api/quotation_comparative/'+id)
    .subscribe(r  =>{
      this.reqReceived = r;
      this.comparativeChart2=this.reqReceived;
      console.log("datos cargados!!")
      console.log(this.comparativeChart2)
      if(this.comparativeChart2.length==0){
        this.detailsQuotation=this.quotationsCompleted[0].priceQuotationDetail
    
        this.sizeDetails=this.detailsQuotation.length
        console.log(this.quotationsCompleted)
        this.loadQuotation();
        this.refresh();
      }else{
        console.log(this.status)
       if(this.status=='Cotizando'&& this.pressedNew==true){
         this.dataSourceBusiness.data=[]
          this.detailsQuotation=this.quotationsCompleted[0].priceQuotationDetail
        this.sizeDetails=this.detailsQuotation.length
          this.updateQuotation();
          this.refresh()
          console.log(this.comparativeChartSend)
        }else{
          this.loadQuotationGet();
        this.refreshGet();
        } 
        
      }
      
    })
    
  } 
  saveChart(id:any){
    this.RequestService.post('http://localhost:8080/api/quotation_comparative/'+id,this.comparativeChartSend)
    .subscribe( respuesta =>{
      console.log('Cuadro guardado!!', this.comparativeChartSend);
    })
  }
  changeChart(id:any){
    this.RequestService.put('http://localhost:8080/api/quotation_comparative/'+id,this.comparativeChartSend)
    .subscribe( respuesta =>{
      console.log('Cuadro reemplazado!!', this.comparativeChartSend);
    })
  }
  loadQuotation(){
    console.log(this.quotationsCompleted)
    let id=0
    while(id< this.sizeDetails){
      var result={}
      var quantity={};var unit={};var description={};var company={};
      var itemChartComplete={};var quotDetail={};this.quotatioBusiness=[]
          quantity['quantity']=this.quotationsCompleted[0].priceQuotationDetail[id].quantity
          unit['unit']=this.quotationsCompleted[0].priceQuotationDetail[id].unit
          description['description']=this.quotationsCompleted[0].priceQuotationDetail[id].description
          quotDetail=Object.assign(quantity,unit,description)
      this.quotationsCompleted.forEach(i=> {
         var loadBusiness={};var name={}; var subtotal={}
          result[i.nameBussiness]=i.priceQuotationDetail[id].totalPrice
          result=Object.assign(result)

          name['nameBusiness']=i.nameBussiness
          subtotal['subtotal']=i.priceQuotationDetail[id].totalPrice
          loadBusiness=Object.assign(name,subtotal)
          this.quotatioBusiness.push(loadBusiness)
          
      })
        company['quotationBusiness']=this.quotatioBusiness
        itemChartComplete=Object.assign(quotDetail,company)
        this.comparativeChartSend.push(itemChartComplete)
        this.nuevaTabla=Object.assign(this.detailsQuotation[id],result)
        this.comparativeChart.push(this.nuevaTabla)
        this.businessList.push(result)
        id++;   
    } 
    this.saveChart(this.idReqSpending); 
  }
  updateQuotation(){
    console.log(this.quotationsCompleted)
    let id=0
    console.log(this.sizeDetails)
    while(id< this.sizeDetails){
      var result={}
      var quantity={};var unit={};var description={};var company={};
      var itemChartComplete={};var quotDetail={};this.quotatioBusiness=[]
          quantity['quantity']=this.quotationsCompleted[0].priceQuotationDetail[id].quantity
          unit['unit']=this.quotationsCompleted[0].priceQuotationDetail[id].unit
          description['description']=this.quotationsCompleted[0].priceQuotationDetail[id].description
          quotDetail=Object.assign(quantity,unit,description)
      this.quotationsCompleted.forEach(i=> {
         var loadBusiness={};var name={}; var subtotal={}
          result[i.nameBussiness]=i.priceQuotationDetail[id].totalPrice
          result=Object.assign(result)

          name['nameBusiness']=i.nameBussiness
          subtotal['subtotal']=i.priceQuotationDetail[id].totalPrice
          loadBusiness=Object.assign(name,subtotal)
          this.quotatioBusiness.push(loadBusiness)
          
      })
        company['quotationBusiness']=this.quotatioBusiness
        itemChartComplete=Object.assign(quotDetail,company)
        this.comparativeChartSend.push(itemChartComplete)
        this.nuevaTabla=Object.assign(this.detailsQuotation[id],result)
        this.comparativeChart.push(this.nuevaTabla)
        this.businessList.push(result)
        id++;   
    } 
    this.changeChart(this.idReqSpending)
  }
  loadQuotationGet(){
    var result={}
      this.comparativeChart2.map(i=> {
        result={};var quantity={};var unit={};var description={};var quotDetail={}
          quantity['quantity']=i.quantity
          unit['unit']=i.unit
          description['description']=i.description
          quotDetail=Object.assign(quantity,unit,description)
        i.quotationBusiness.forEach(q=>{
          result[q.nameBusiness]=q.subtotal
        result=Object.assign(result)
        })
        this.businessList.push(result)
        this.comparativeChart.push(Object.assign(quotDetail,result))
      })
    // console.log(this.businessList)
     
  }
  refreshGet() {
    this.displayedColumnsBusiness=this.displayedColumns.concat(this.comparativeChart2[0].quotationBusiness.map(i=>i.nameBusiness)
    )
     this.dataSourceBusiness.data = this.comparativeChart;
  } 
  getNameColumn(nameColumn){
    var name=''
    if(nameColumn=='quantity'){
      name="CANTIDAD"
    }else{
      if(nameColumn=='unit'){
        name="UNIDAD"
      }else{
        if(nameColumn=='description'){
        name="DETALLE"
        }else{
        name=nameColumn
      }
    }
  }
  return name
}
  getTotalCost(nameColumn) {
    var total:any;
    if(nameColumn=='quantity'){
      total="TOTALES"
    }else{if(nameColumn=='unit'|| nameColumn=='description'){
      total=""
    }else{
      total=this.businessList.map(t => t[nameColumn]).reduce((acc, value) => acc + value, 0);
    }
  }
    return total
  }
}