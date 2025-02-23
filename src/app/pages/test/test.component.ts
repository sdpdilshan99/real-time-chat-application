import { Component } from '@angular/core';
import { ChatBubbleConfig } from '../../interfaces/ui-configs/chat-bubble-config.interface';
import { ChatBubbleComponent } from "../../components/chat-bubble/chat-bubble.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { UserChatCardComponent } from "../../components/user-chat-card/user-chat-card.component";
import { UserChatConfig } from '../../interfaces/ui-configs/user-chat-config.interface';

@Component({
  selector: 'app-test',
  imports: [ChatBubbleComponent, SearchInputComponent, UserChatCardComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone:true
})
export class TestComponent {

  leftConfig: ChatBubbleConfig = {
    text: 'hello how are you',
    position: 'left'
  }
  rightConfig: ChatBubbleConfig = {
    text: 'i am fine. you?',
    position: 'right'
  }

  userChat: UserChatConfig = {
    fullName: 'sadeep',
    text: 'how are you',
    time: '20:00',
    profile: 'assets/user-profile.png',
    isActive: false
  }

  userChatActive: UserChatConfig = {
    fullName: 'sadeep',
    text: 'how are you',
    time: '20:00',
    profile: 'assets/user-profile.png',
    isActive: true
  }

  handleSearch($event: string){
    console.log('Parent:', $event);
  }
}
