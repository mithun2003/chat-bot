import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../service/user.service';
import { MessageData } from '../../../../shared/model/model';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatPage.component.html',
  styleUrls: ['./chatPage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class ChatPageComponent implements OnInit, AfterViewChecked , OnDestroy {
  private subscriptions: Subscription[] = [];
  messages: MessageData[] = [];

  userService = inject(UserService);
  messageInput = '';
  eventReact = 1;
  buttonDisable = false;
  messageLoading = false;
  showCustomerSupportAdd = false;
  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  ngOnInit(): void {   
    this.userService.initializeWebSocket();
    this.subscriptions.push(
      this.userService.onMessage().subscribe((event) => {
        const eventData = JSON.parse(event.data);
        if (eventData.event_type === 1) {
          this.messageLoading=false;
          this.messages.push(eventData);
        }
        if (eventData.event_type === 5) {
          this.eventReact = 2;
          // this.showCustomerSupportAdd = true;
          this.messages.push(eventData);
        }
      })
    );
  }

  sendMessage(message: string): void {
    this.messageInput = '';
    const messageData = {
      event_type: 1,
      event_person: 3,
      event_react: this.eventReact,
      session_id: this.userService.userId().toString(),
      data: message
    };

    // Convert the message data to a JSON string
    const jsonString = JSON.stringify(messageData);

    // Send the JSON string as the message
    if (message) {
      this.messages.push(messageData);
      this.messageLoading = true;
      this.userService.sendMessage(jsonString);
    }
  }

  isBulletPointFormat(data: string): boolean {
    return data.includes('\n');
  }

  submitHelp() {
    const submitData = {
      event_type: 2,
      event_person: 3,
      event_react: 2,
      session_id: this.userService.userId(),
      data: 'Need customer support help'
    };
    const jsonString = JSON.stringify(submitData);
    this.userService.sendMessage(jsonString);
    this.buttonDisable = true;
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

  /**
   * @description Unsubscribe all subscriptions when the component destroys
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
