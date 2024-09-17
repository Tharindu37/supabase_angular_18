import {
  AfterViewChecked,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewChecked {
  private auth = inject(AuthService);
  private router = inject(Router);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  chats = signal<Chat[]>([]);
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required],
    });

    effect(() => {
      this.onListChat();
    });
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  async logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  onSubmit() {
    const formValue = this.chatForm.get('chat_message')?.value;
    console.log(formValue);
    this.chatService
      .chatMessage(formValue)
      .then((res) => {
        console.log(res);
        this.chatForm.reset();
        this.onListChat();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  onListChat() {
    this.chatService
      .listChat()
      .then((res: Chat[] | null) => {
        console.log(res);
        if (res) this.chats.set(res);
        else console.log('No messages Found');
      })
      .catch((err) => {
        alert(err.meesage);
      });
  }

  deleteMsg(msg: Chat) {
    if (confirm('Are you sure want to delete this message?')) {
      console.log('delete');
      this.chatService
        .deleteChat(msg.id)
        .then((res) => {
          console.log(res);
          this.onListChat();
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }
}
