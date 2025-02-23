import { collection, Firestore, onSnapshot, query, where, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { ChatRoom, Message } from '../interfaces/models/chat-room.interface';
import { user } from '@angular/fire/auth';
import { getDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  USER = 'user';
  CHAT_ROOM = 'chat-room';
  authService = inject(AuthService);

  userSubject: Subject<any[]> = new Subject();
  chatRoomSubject: Subject<ChatRoom> = new Subject();

  constructor(private firestore: Firestore) { }

  getAllUsers() {
    const userCollection = collection(this.firestore, this.USER);
    const userId = this.authService.getCurrentUser().uid ?? '';
    const queryRef = query(userCollection, where('userId', '!=', userId));
     let users: any[] = [];


     return onSnapshot(queryRef, (snapShot) => {
      const data = snapShot.docChanges().map((docs) => {

        if(docs.type === 'added'){
          const userId = this.authService.getCurrentUser().uid ?? '';
          if(userId !== docs.doc.id){
            users.push({...docs.doc.data()});
            this.userSubject.next(users);
          }

        }else if(docs.type === 'removed'){
          const user =  docs.doc.data() as any;
          users = users.filter((u) => u.userId !== user.userId);
          this.userSubject.next(users);

        }else if(docs.type === 'modified'){
          const user =  docs.doc.data() as any;
          const index = users.findIndex((u) => u.userId !== user.userId);
          users[index] = docs.doc.data();
          this.userSubject.next(users);
        }
      })
     });
  }

  getChatRoom(user: {userId:string}){
    const currentUserId = this.authService.getCurrentUser().uid ?? '';
    const chatRoomCollection = collection(this.firestore, this.CHAT_ROOM);
    const queryRef = query(chatRoomCollection, where('users', 'array-contains', user.userId));

    return onSnapshot(queryRef, async (snapShot) => {
      const snapData = snapShot.docs.find((doc) =>
        (doc.data() as ChatRoom).users.includes(currentUserId));

      if(snapData){
        const data: ChatRoom = {chatRoomId: snapData.id, ...snapData.data()} as ChatRoom

        this.chatRoomSubject.next(data);
      }else{
        const createChatRoom: ChatRoom ={
          users: [currentUserId, user.userId],
          lastMessage: '',
          messages: [],
          lastMessageTimestamp: new Date()

        }
        const newChatRoom = await addDoc(chatRoomCollection, createChatRoom);
        const data:ChatRoom = {chatRoomId: newChatRoom.id, ...createChatRoom} as ChatRoom;
        this.chatRoomSubject.next(data);
      }

      })
    }

  async addMessage(chatRoomId: string, chatRoomMessage: Message){
    const chatRoomCollection = collection(this.firestore, this.CHAT_ROOM);
    const docRef = doc(this.firestore, this.CHAT_ROOM, chatRoomId);
    const chatRoomDoc = await getDoc(docRef);

    if(!chatRoomDoc.exists()){
      // nothimg in section
    }else{
      const data = chatRoomDoc.data() as ChatRoom;

      data.lastMessageTimestamp = new Date();
      data.lastMessage = chatRoomMessage.messageText;
      data.messages.push(chatRoomMessage);
      updateDoc(docRef,{...data})
    }


  }

  }

