import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required],
    });
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
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
