import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceService } from '../../resource/resource.service';

@Injectable({
  providedIn: 'root'
})
export class SearchImageService {
  serachImageURL: string;
  initSearchKey: string;

  constructor(private http: HttpClient, private resourceSrv: ResourceService) {
    this.initResource();
  }

  private initResource(): void {
    this.serachImageURL = this.resourceSrv.getConstValue('image.search.url');
    this.initSearchKey = this.resourceSrv.getConstValue('search.image.init,searchKey');
  }

  getImageList(searchData, pageIndex, pageSize): Observable<any> {
    if (searchData === null || searchData === undefined) {
      searchData = '';
    }
    const URL = this.serachImageURL.replace('0', searchData !== '' ? searchData : this.initSearchKey)
      .replace('1', pageSize).replace('2', pageIndex);
    return this.http.get(URL);

  }
}
