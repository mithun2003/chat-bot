import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  inject,
  input
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageData, SessionData } from 'src/app/shared/model/model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminService } from '../../service/admin.service';
import { DashboardOldChatPageComponent } from '../dashboard-old-chat-page/dashboard-old-chat-page.component';

@Component({
  selector: 'app-dashboard-chat-page',
  templateUrl: './dashboard-chat-page.component.html',
  styleUrls: ['./dashboard-chat-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    DashboardOldChatPageComponent
  ]
})
export class DashboardChatPageComponent implements AfterViewChecked {
  selectedSessionId = input.required<string>();
  selectedOlderSessionId = input<string>();
  adminService = inject(AdminService);
  private subscriptions: Subscription[] = [];
  messages: MessageData[] = [];
  showInput = false;
  messageInput = '';
  oldMessage?: SessionData[];
  showOldMessage: boolean = false;

  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  getMessagesBySessionId(sessionId: string): MessageData[] {
    return this.adminService.messages.filter(
      (message) => message.session_id === sessionId && message.event_type === 1
    );
  }

  sendMessage(message: string): void {
    this.messageInput = '';
    const lastQuery = this.adminService.messages
      .slice()
      .reverse()
      .find((msg) => msg.event_person === 3 && msg.event_type === 1);
    const messageData = {
      event_type: 1,
      event_person: 2,
      event_react: 3,
      session_id: this.selectedSessionId(),
      data: message,
      query: lastQuery ? lastQuery.data : ''
    };

    const jsonString = JSON.stringify(messageData);

    this.adminService.sendMessage(jsonString);
    // Add the sent message to the messages array
    // this.messages.push(messageData);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    }
  }
}
