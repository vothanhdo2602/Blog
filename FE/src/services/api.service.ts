import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";

import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private accessToken: string = '';
  private _baseURl = environment.baseURL;
  public static user;

  constructor(private http: HttpClient) {
    ApiService.user = localStorage.getItem('User');
  }

  public login(body: any): Observable<any>{
    return this.http.post(this._baseURl + "/login", body)
    .pipe( catchError( error => this.handleError(error) ));
  }

  public register(body: any): Observable<any>{
    return this.http.post(this._baseURl + "/register", body)
    .pipe( catchError( error => this.handleError(error) ));
  }

  public createPost(body: any): Observable<any>{
    return this.http.post(this._baseURl + "/post/create-post", this.getAuthHeaders(true))
    .pipe( catchError( error => this.handleError(error) ));
  }

  public getPage(page: any): Observable<any>{
    return this.http.get(this._baseURl + "/post?page=" + page)
    .pipe( catchError( error => this.handleError(error) ));
  }

  public searchByTag(tag: any): Observable<any>{
    return this.http.get(this._baseURl + "/post/search-by-tag?tag=" + tag)
    .pipe( catchError( error => this.handleError(error) ));
  }

  public searchByTitle(title: any): Observable<any>{
    return this.http.get(this._baseURl + "/post/search-by-title?title=" + title)
    .pipe( catchError( error => this.handleError(error) ));
  }

  public updatePost(body: any): Observable<any>{
    return this.http.put(this._baseURl + "/post/update-post", body, this.getAuthHeaders(true))
    .pipe( catchError( error => this.handleError(error) ));
  }

  public deletePost(body: any): Observable<any>{
    return this.http.delete(this._baseURl + "/post/delete-post", this.getAuthHeaders(true, body))
    .pipe( catchError( error => this.handleError(error) ));
  }

  public createComment(body: any): Observable<any>{
    return this.http.post(this._baseURl + "/comment/create-comment", body, this.getAuthHeaders(true))
    .pipe( catchError( error => this.handleError(error) ));
  }

  public updateComment(body: any): Observable<any>{
    return this.http.put(this._baseURl + "/comment/update-comment", body, this.getAuthHeaders(true))
    .pipe( catchError( error => this.handleError(error) ));
  }

  public deleteComment(body: any): Observable<any>{
    return this.http.delete(this._baseURl + "/comment/delete-comment", this.getAuthHeaders(true, body))
    .pipe( catchError( error => this.handleError(error) ));
  }

  private getAuthHeaders(includeJsonContentType?: boolean, body?: any) {
    if (localStorage.getItem('User')){
      let user = JSON.parse(localStorage.getItem('User') || '{}');
      if (user?.accessToken){
        this.accessToken = user.accessToken;
      }
    }
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.accessToken });
    if (includeJsonContentType){
      headers.append('Content-Type', "application/json");
    }
    headers.append('Accept', 'application/json, text/plain, */*');
    if (body){
      return { headers, body }
    }
    return { headers };
  }

  private handleError(error: any){
    let errorMsg: string;
    if ( error.error instanceof ErrorEvent ) {
      errorMsg = `Error: ${error.error.message}`;
    }
    else {
      errorMsg = this.getServerErrorMessage(error);
    }
    return throwError(errorMsg);
}

  private getServerErrorMessage(errorResponse: HttpErrorResponse){
    switch ( errorResponse.status ){
      case 401: {
        localStorage.clear();
        return `Not found: ${errorResponse.message}`;
      }
      case 403: {
        localStorage.clear();
        return `Access denied: ${errorResponse.message}`;
      }
      case 404: {
        return `Not found: ${errorResponse.message}`;
      }
      case 500: {
        return `Internal server error: ${errorResponse.message}`;
      }
      default: {
        return `Unknown server error: ${errorResponse.message}`;
      }
    }
  }

}