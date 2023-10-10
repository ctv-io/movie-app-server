import { v4 } from 'uuid';
import { Socket } from '../interfaces';

export default class Users {
	/** Master list of all connected users */
	public users: { [uid: string]: string };

	constructor() {
		this.users = {};
	}

	public Create(socket: Socket): string {
		const uid = v4();
		this.users[uid] = socket.id;
		return uid;
	}

	public Delete(uid: string): void {
		delete this.users[uid];
	}

	public GetUidFromSocketId = (socket_id: string) =>
		Object.keys(this.users).find((uid) => this.users[uid] === socket_id);

	public GetAllSocketIds = () => Object.values(this.users);

	public GetAllUserIds = () => Object.keys(this.users);
}
