import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageData, SessionMessageData } from 'src/app/shared/model/model';
import { ScoreCalculationResponse, Session } from '../model/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminRepository {
  private http = inject(HttpClient);

  ROOT_URL = environment.baseUrl;

  scoreCalculation(userId: number): Observable<ScoreCalculationResponse> {
    const request = { id: userId };
    return this.http.post<ScoreCalculationResponse>(
      `${this.ROOT_URL}/ent/ent_score/`,
      request
    );
  }

  fetchSession(): Observable<Session> {
    return this.http.get<Session>(`${this.ROOT_URL}/dashboard/session/`);
  }

  fetchAllMessages(sessionId: string): Observable<SessionMessageData> {
    return this.http.get<SessionMessageData>(
      `${this.ROOT_URL}/dashboard/chat/${sessionId}`
    );
  }
}
