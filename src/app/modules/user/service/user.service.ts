import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userWebSocket?: WebSocket;
  userId = signal<string>('');
  WEB_SOCKET_URL = environment.WebSocketUrl;
  localStorageService = inject(LocalStorageService);

  initializeWebSocket() {
    this.userId.set(uuidv4());
    const tempWSUrl: string | null =
      this.localStorageService.getItem('tempWSUrl');

    if (tempWSUrl) {
      this.userWebSocket = new WebSocket(
        `${tempWSUrl}/chat/ws/${this.userId().toString()}`
      );
    } else {
      this.userWebSocket = new WebSocket(
        `${this.WEB_SOCKET_URL}/chat/ws/${this.userId().toString()}`
      );
    }
  }

  // Method to send messages
  sendMessage(message: string): void {
    this.userWebSocket?.send(message);
  }

  // Method to handle incoming messages
  onMessage(): Subject<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    if (this.userWebSocket) {
      this.userWebSocket.onmessage = (event) => {
        subject.next(event);
      };
    }

    return subject;
  }
}
