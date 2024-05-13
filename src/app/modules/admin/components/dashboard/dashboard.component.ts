import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from '@angular/material/badge';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonButtonComponent } from 'src/app/shared/components/common-button/common-button.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeBaseUrlModalDevComponent } from 'src/app/modules/auth/change-base-url-modal-dev/change-base-url-modal-dev.component';
import { AdminService } from '../../service/admin.service';
import { NotificationModalComponent } from '../../modal/notification-modal/notification-modal.component';
import { MessageData, SessionData } from '../../../../shared/model/model';
import { DashboardChatPageComponent } from '../dashboard-chat-page/dashboard-chat-page.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NotificationModalComponent,
    MatBadgeModule,
    DashboardChatPageComponent,
    CommonButtonComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  messages: MessageData[] = [];
  sessionIds: string[] = [];
  olderSessionIds: string[] = [];
  selectedSessionId: string = '';
  selectedOlderSessionId: string = '';
  showModal = false;
  personalMessage?: SessionData[];

  adminService = inject(AdminService);
  eventTypeLength = 0;
  messageInput = '';
  showInput = false;
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  ngOnInit(): void {
    this.adminService.initializeWebSocket();
    this.fetchSessionIds();
    this.subscriptions.push(
      this.adminService.onMessage().subscribe((event) => {
        this.adminService.fetchLatestMessage(event);
      })
    );
  }

  fetchSessionIds() {
    this.subscriptions.push(
      this.adminService.fetchSessionIds().subscribe((res) => {
        res.sessions.forEach((sessionId: string) =>
          this.olderSessionIds.push(sessionId)
        );
      })
    );
  }

  // selectSession() {
  //   this.subscriptions.push(
  //     this.activeRoute.params.subscribe((params) => {
  //       const { sessionId } = params;

  //       if (
  //         sessionId &&
  //         this.adminService.sessionIds.find((session) => session === sessionId)
  //       ) {
  //         this.selectedSessionId = sessionId;
  //       }
  //     })
  //   );
  // }

  // onTabSelect(id: string) {
  //   this.selectedSessionId = id;
  //   this.router.navigate(['/admin/dashboard', id]);
  // }

  /**
   * @description Open a dialog to change the base URL, primarily used for testing purposes in staging environments.
   */
  onChangeBaseUrl(): void {
    this.dialog.open(ChangeBaseUrlModalDevComponent, {
      maxWidth: '550px',
      width: '93%'
    });
  }

  showMessages(sessionId: string): void {
    this.selectedSessionId = sessionId;
    this.selectedOlderSessionId = '';
  }

  getEventTypeIs2(): MessageData[] {
    const eventTypeFilter = this.adminService.messages.filter(
      (message) => message.event_type === 2
    );
    this.eventTypeLength = eventTypeFilter.length;
    return eventTypeFilter;
  }

  removeEventFromMessage(sessionIdToRemove: string): void {
    this.adminService.removeEventFromMessage(sessionIdToRemove);
  }

  isBulletPointFormat(data: string): boolean {
    return data.includes('\n');
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
