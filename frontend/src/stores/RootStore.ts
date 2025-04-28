import { makeAutoObservable } from 'mobx';
import { EventStore } from './EventStore';
import { UserStore } from './UserStore';

export class RootStore {
  eventStore: EventStore;
  userStore: UserStore;

  constructor() {
    makeAutoObservable(this);
    this.eventStore = new EventStore(this);
    this.userStore = new UserStore(this);
  }
}

export const rootStore = new RootStore(); 