import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  public post(url:string, body){
    return this.http.post(url,body);
  }
  public get(url:string){
    return this.http.get(url);
  }
}