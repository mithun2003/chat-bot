import { Component, Input, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionData } from 'src/app/shared/model/model';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-dashboard-old-chat-page',
  templateUrl: './dashboard-old-chat-page.component.html',
  styleUrls: ['./dashboard-old-chat-page.component.css'],
  standalone: true
})
export class DashboardOldChatPageComponent {
  adminService = inject(AdminService);
  private subscriptions: Subscription[] = [];
  messages: SessionData[] = [];
  showMessages: boolean = false;

  @Input() set selectedOlderSessionId(value: string) {
    if (value) {
      this.subscriptions.push(
        this.adminService.getAllMessages(value).subscribe((message) => {
          this.messages = message.sessions;
        })
      );
      this.showMessages = true;
    }
  }

}
