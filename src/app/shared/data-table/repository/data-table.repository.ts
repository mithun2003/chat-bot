import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { LocalStorageService } from 'src/app/shared/services/storage/local-storage.service';
import {
  IDataTableResponse,
  IcellRendererParams
} from '../model/data-table.model';

/**
 * @description - Service for fetching data for a specific table from the data source and some other datas related to data.
 */
@Injectable({
  providedIn: 'root'
})
export class DataTableRepository {
  /**
   * Reference to the HttpClient service for making HTTP requests.
   */
  private http = inject(HttpClient);
//   private localStorageService = inject(LocalStorageService);
  router = inject(Router);

  UserId: number | undefined;

  private endpoints: { [key: string]: string } = {
    ent: '/ent/',
    apiUsage: '/admin/requests',
    api_log: '/admin/api_logs',
    complaints: '/admin/tickets?status=Submitted',
    tiers_list: '/admin/tier/tiers',
    resolved: '/admin/tickets?status=Resolved',
    black_list: '/admin/blacklist/',
    attributes: '/attributes',
    tickets: '/tickets',
    latest_requests: '/api/v1/latest-requests/',
    admin_tickets: '/tickets/',
    admin_resolved: '/tickets/'
  };

  /**
   * The ID of the current table for which data is being fetched.
   */
  tableUrl: string | undefined;

  /**
   * The root URL for making API requests.
   */
  ROOT_URL = environment.baseUrl;
  /**
   * Fetches data for a specific table from the data source.
   *
   * @template IDynamicResponseType - The type of the dynamic response data.
   *
   * @param {string} tableUrl - The ID of the table for which to fetch data.
   * @param {unknown} [postData] - Optional data to be included in the HTTP POST request payload.
   * @returns {Observable<IDataTableResponse>} An observable that emits the response containing the table data.
   */
  getTableListData(
    tableUrl: string,
    postData?: unknown
  ): Observable<IDataTableResponse> {
    /**
     *  Set the tableUrl property of the service to the provided tableUrl.
     *  This allows other methods to access the current tableUrl value.
     */
    this.tableUrl = tableUrl;

    /**
     * Call the HTTP POST method to fetch the table data.
     * The response data is expected to have the type ICoulmnDefFieldsResponse<IDynamicResponseType>.
     */
    let response!: Observable<IDataTableResponse>;
    if (tableUrl === 'apiUsage' || tableUrl === 'api_log') {
      const { url } = this.router;
      const id = url.split('/').pop();
      response = this.http.post<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}/${id}`,
        postData
      );
    } else if (tableUrl === 'attributes') {
      const { url } = this.router;
      const requestId = url.split('/')[5];
      const id = url.split('/').pop();
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}/api/v1${this.endpoints[tableUrl]}?user_id=${id}&request_id=${requestId}`
      );
    } else if (tableUrl === 'live_api_key') {
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}/platform/apikey/?live=true`
      );
    } else if (tableUrl === 'admin_tickets') {
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}?filter=open`
      );
    } else if (tableUrl === 'admin_resolved') {
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}?filter=resolved`
      );
    } else if (tableUrl === 'sandbox_api_key') {
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}/api/v1/platform/apikey/?live=false`
      );
    } else if (tableUrl === 'latest_requests') {
      const { url } = this.router;
      const id = url.split('/').pop();
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}${id}`
      );
    } else if (tableUrl === 'tickets') {
      const platformId = Number(
        // this.localStorageService.getItem('platform_id')
        localStorage.getItem('platform_id')
      );
      response = this.http.get<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}/${platformId}/`
      );
    } else {
      response = this.http.post<IDataTableResponse>(
        `${this.ROOT_URL}${this.endpoints[tableUrl]}`,
        postData
      );
    }
    return response;
  }

  blockUnblock(
    emails: { email: string }[],
    id: string
  ): Observable<[{ status_code: number; message: string; email: string }]> {
    const response = this.http.patch<
      [{ status_code: number; message: string; email: string }]
    >(`${this.ROOT_URL}/admin/block_unblock_platform?operation=${id}`, emails);
    return response;
  }

  deleteRow(params: IcellRendererParams) {
    const response = this.http.delete(
      `${this.ROOT_URL}/admin/tier/${params.data.id}`
    );
    return response;
  }

}
