import { ChatBubbleConfig } from './../../interfaces/ui-configs/chat-bubble-config.interface';
import { Component, OnInit } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CommonModule } from '@angular/common';
import { UserChatConfig } from '../../interfaces/ui-configs/user-chat-config.interface';
import { UserChatCardComponent } from "../../components/user-chat-card/user-chat-card.component";
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { ChatBubbleComponent } from "../../components/chat-bubble/chat-bubble.component";
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ChatRoom, Message } from '../../interfaces/models/chat-room.interface';


@Component({
  selector: 'app-chats',
  imports: [SearchInputComponent, CommonModule, UserChatCardComponent, ChatBubbleComponent,
    ReactiveFormsModule
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  standalone:true
})
export class ChatsComponent implements OnInit {
  userChats: UserChatConfig[] = [];
  currentUser: any;
  senderUser: any;
  chats: ChatBubbleConfig[] = [];
  messageControl: FormControl = new FormControl('',[Validators.required] );
  chatRoomData!: ChatRoom

  constructor(public authService: AuthService, private chatService: ChatService){}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.getUsers();
    this.getAllChats();
  }

  loadCurrentUser() {
    this.authService.getUserById().then((res) => {
      this.currentUser = res;
    }).catch((err) => {
      console.error('Error loading user:', err);
    });
  }

  getUsers() {
    this.chatService.userSubject.subscribe((res) => {
      this.userChats = res.map((item, index) => {
        const user : UserChatConfig = {
          fullName: item.fullName,
          text: '',
          time: '',
          profile: item.profile,
          isActive: false,
          onClick: () => {
            const chatUserId = item.userId;
            this.senderUser = user;
            this.senderUser.userId = chatUserId;
            this.userChats.map((u) => u.isActive = false);
            user.isActive = true;

            this.chatService.getChatRoom(this.senderUser);
          }
        }
        this.getLastTextMessage(item, user);
        this.getLastMessageTimestamp(item, user);
        return user;
      });

      if (this.userChats.length === 0) {
      console.log('No users in userChats.');
    } else {
      console.log('User Chats:', this.userChats);

    }

    });
    this.chatService.getAllUsers();

  }

  getAllChats() {
    this.chatService.chatRoomSubject.subscribe((res) => {
      this.chatRoomData = res;
      this.chats = res.messages.map((item) => {
        let getUser = this.authService.getCurrentUser().uid
        return {
          text: item.messageText,
          position: item.senderId === getUser ? 'right' : 'left'
        } as ChatBubbleConfig
      })
    })
  }

  addMessage() {
    if(!this.messageControl.value) {
      return;
    }

    const message: Message = {
      senderId: this.authService.getCurrentUser().uid ?? '',
      messageText: this.messageControl.value,
      timestamp: new Date(),
      read: false,
      messageType: 'text',
      fullName: this.currentUser.fullName
    }

    this.chatService.addMessage(this.chatRoomData.chatRoomId ?? '', message)
    this.messageControl.reset();
  }

  getLastTextMessage(item:any, user: UserChatConfig){
    let lastText= ''
    this.chatService.getLastText(item).subscribe((res: any) => {
      if(res){
        lastText = res?.lastText ?? '';
        user.text = lastText;
      }

    })
  }

  getLastMessageTimestamp(item:any, user: UserChatConfig){
    let lastMessageTime : any
    this.chatService.getLastText(item).subscribe((res: any) => {
      if(res){
        lastMessageTime = res?.time;
        const date = new Date(lastMessageTime.seconds * 1000);

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        user.time = `${hours}:${minutes}`;
      }

    })
  }



  handleSearch(searchTerm: string) {
    if (!searchTerm) {
      this.getUsers();
    } else {
      // Filter the userChats based on searchTerm (by full name or last text)
      this.userChats = this.userChats.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }



}
