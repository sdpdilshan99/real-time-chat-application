import { Component, Input } from '@angular/core';
import { ChatBubbleConfig } from '../../interfaces/ui-configs/chat-bubble-config.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-bubble',
  imports: [CommonModule],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss',
  standalone: true
})
export class ChatBubbleComponent {
  @Input() config!: ChatBubbleConfig;
}
