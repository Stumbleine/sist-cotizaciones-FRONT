import { Injectable, Output ,EventEmitter } from '@angular/core';
import{HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  @Output() disparadorChart: EventEmitter<any>=new EventEmitter();
  constructor(
    private http: HttpClient,
  ) { }

  public post(url:string, body){
    return this.http.post(url,body);
  }
  public get(url:string){
    return this.http.get(url);
  }
  public put(url:string, body){
    return this.http.put(url,body);
  }
  public putState(url:string, body){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    }
    return this.http.put(url,body,httpOptions);
  }

  public getFile(url:string){
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
  public delete(url:string){

      return this.http.delete(url);
    
  }
}