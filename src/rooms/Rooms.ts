import { v4 } from 'uuid';
import { Socket } from '../interfaces';

export default class Rooms {
	/** Master list of all rooms */
	public rooms: { [rid: string]: Set<string> };

	constructor() {
		this.rooms = {};
	}

	public Join = (socket: Socket, rid: string): void => {
		socket.join(rid);
		this.rooms[rid].add(socket.id);
	};

	public Create = (rid = ''): string => {
		const innerRid = rid || v4();
		this.rooms[innerRid] = new Set();

		return innerRid;
	};

	public Delete = (rid: string): void => {
		delete this.rooms[rid];
	};

	public DeleteUserFromRoom = (rid: string, uid: string): boolean => {
		return this.rooms[rid].delete(uid);
	};

	public GetUserRoom = (socket: Socket): string | null => {
		let rRoom: string | null = null;
		this.GetAllRooms().forEach((room) => {
			if (this.rooms[room].has(socket.id)) rRoom = room;
		});
		return rRoom;
	};

	public GetAllUsersFromRoom = (rid: string): Set<string> | undefined => {
		return this.rooms[rid];
	};

	public GetAllRooms = (): string[] => {
		return Object.keys(this.rooms);
	};

	public HasRoom = (rid: string): boolean => {
		return Boolean(this.rooms[rid]);
	};
}
