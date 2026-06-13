import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeaweedService {

  private masterUrl = '/seaweed-master';
  private volumeUrl = '/seaweed-volume';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<string> {
    return this.http.get<any>(`${this.masterUrl}/dir/assign`).pipe(
      switchMap(assign => {
        const fid = assign.fid;

        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<any>(`${this.volumeUrl}/${fid}`, formData).pipe(
          map(() => `http://localhost:8888/${fid}`)
        );
      })
    );
  }
}