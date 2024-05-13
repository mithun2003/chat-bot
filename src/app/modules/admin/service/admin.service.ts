import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/shared/alert/service/alert.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { MessageData, SessionMessageData } from '../../../shared/model/model';
import { AdminRepository } from '../repository/admin.repositroy';
import { Session } from '../model/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements OnDestroy {
  private dashboardWebSocket?: WebSocket;
  showModal = signal<boolean>(false);
  showInput = signal<boolean>(false);
  notifications = signal<MessageData[]>([]);
  WEB_SOCKET_URL = environment.WebSocketUrl;
  adminRepository = inject(AdminRepository);
  alertService = inject(AlertService);
  sessionIds: string[] = [];
  private subscriptions: Subscription[] = [];
  messages: MessageData[] = [];
  localStorageService = inject(LocalStorageService);

  initializeWebSocket() {
    const tempWSUrl: string | null =
      this.localStorageService.getItem('tempWSUrl');

    if (tempWSUrl) {
      this.dashboardWebSocket = new WebSocket(`${tempWSUrl}/dashboard/ws/`);
    } else {
      this.dashboardWebSocket = new WebSocket(
        `${this.WEB_SOCKET_URL}/dashboard/ws/`
      );
    }
  }

  // Method to send messages
  sendMessage(message: string): void {
    this.dashboardWebSocket?.send(message);
  }

  // Method to handle incoming messages
  onMessage(): Subject<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    if (this.dashboardWebSocket) {
      this.dashboardWebSocket.onmessage = (event) => {
        subject.next(event);
      };
    }

    return subject;
  }

  showNotificationModal(): void {
    this.showModal.set(!this.showModal());
  }

  submitUserId(id: number): void {
    this.subscriptions.push(
      this.adminRepository.scoreCalculation(id).subscribe((res) => {
        if (res.status_code === 200) {
          const data = {
            content: res.message
          };
          this.alertService.alertMessage('success', data);
        }
      })
    );
  }

  // fetchSessionIds(){
  //   this.subscriptions.push(
  //     this.adminRepository.fetchSession().subscribe((res) => {
  //       res.sessions.forEach((sessionId: string) =>
  //         this.olderSessionIds.push(sessionId)
  //       );
  //     })
  //   );
  // }
  fetchSessionIds(): Observable<Session> {
    return this.adminRepository.fetchSession();
  }

  eventPersonIs2(sessionId: string): boolean {
    const filteredMessages = this.messages.filter(
      (message) => message.session_id === sessionId
    );

    if (filteredMessages.length > 0) {
      const lastMessage = filteredMessages[filteredMessages.length - 1];
      return (
        (lastMessage.event_type === 1 || lastMessage.event_type === 2) &&
        ((lastMessage.event_person === 3 && lastMessage.event_react === 2) ||
          (lastMessage.event_person === 2 && lastMessage.event_react === 3))
      );
    }

    return false;
  }

  getAllMessages(sessionId: string): Observable<SessionMessageData> {
    return this.adminRepository.fetchAllMessages(sessionId);
  }

  isBulletPointFormat(data: string): boolean {
    return data.includes('\n');
  }

  fetchLatestMessage(event: MessageEvent) {
    const eventData = JSON.parse(event.data);

    this.messages.push(eventData);
    if (eventData.data === 'Help Accepted') {
      this.messages = this.messages.filter(
        (message) =>
          !(
            message.event_type === 2 &&
            message.session_id === eventData.session_id
          )
      );
    }
    if (
      !this.sessionIds.includes(eventData.session_id) &&
      eventData.event_type === 1
    ) {
      if (this.eventPersonIs2(eventData.session_id)) {
        this.showInput.set(true);
      }
      this.sessionIds.unshift(eventData.session_id);
    }
  }

  removeEventFromMessage(sessionIdToRemove: string): void {
    if (!this.sessionIds.includes(sessionIdToRemove)) {
      this.sessionIds.unshift(sessionIdToRemove);
    }
    this.showInput.set(true);
    this.messages = this.messages.filter(
      (message) =>
        !(
          message.session_id === sessionIdToRemove &&
          (message.event_type === 2 || message.event_type === 5)
        )
    );
  }

  // removeEventFromMessage(sessionIdToRemove: string) {
  //   if (!this.sessionIds.includes(sessionIdToRemove)) {
  //     this.sessionIds.unshift(sessionIdToRemove);
  //   }

  //   this.showInput.set(true) ;
  //   const remainingMessages: MessageData[] = []

  //   this.messages.forEach((message) => {

  //     if (
  //       message.session_id === sessionIdToRemove &&
  //       !(message.event_type === 2 || message.event_type === 5)
  //     ){
  //       remainingMessages.push(message);
  //     }
  //   });

  //   if (remainingMessages.length > 0) {
  //     this.messages = remainingMessages;
  //   }
  // }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
