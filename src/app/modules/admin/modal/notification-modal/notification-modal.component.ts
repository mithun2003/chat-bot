import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  inject,
  signal,
  EventEmitter,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageData } from '../../../../shared/model/model';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationModalComponent implements OnInit {
  @Input() notificationMessages: MessageData[] = [];
  adminService = inject(AdminService);
  notifications = signal<MessageData[]>([]);
  @Output() sessionIdToRemove = new EventEmitter();

  ngOnInit(): void {
    this.notifications.set(this.notificationMessages);
  }

  helpAccept(sessionId?: string) {
    const acceptData = {
      event_type: 5,
      event_person: 2,
      event_react: 3,
      session_id: sessionId,
      data: 'Help Accepted',
    };

    // Convert the message data to a JSON string
    const jsonString = JSON.stringify(acceptData);

    this.notifications.update((values) => [
      ...values.filter((msg) => msg.session_id !== sessionId),
    ]);

    this.adminService.sendMessage(jsonString);
    this.sessionIdToRemove.emit(sessionId);
  }
}
