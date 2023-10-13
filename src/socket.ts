import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { UserCallback } from './interfaces';
import Users from './users/Users';
import handleUsers from './users/handleUsers';
import Rooms from './rooms/Rooms';
import handleRooms from './rooms/handleRooms';

export default class ServerSocket {
	public static instance: ServerSocket;

	public io: Server;

	public users: Users;

	public rooms: Rooms;

	constructor(server: HTTPServer) {
		ServerSocket.instance = this;

		this.users = new Users();
		this.rooms = new Rooms();
		this.io = new Server(server, {
			cors: {
				origin: '*',
			},
			serveClient: false,
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: false,
		});

		this.io.on('connect', this.StartListeners);

		console.info('Socket server initialized');
	}

	StartListeners = (socket: Socket): void => {
		console.info(`Message received from ${socket.id}`);
		const { handleReconnect, handleGenerateNewUser, handleDisconnect } =
			handleUsers;
		const { handleCreateRoom, handleJoinRoom, handleLeaveRoom } = handleRooms;

		socket.on('create_room', () => {
			handleCreateRoom({
				socket,
				rooms: this.rooms,
				server: this,
			});
		});

		socket.on('join_room', (rid) => {
			handleJoinRoom({ rid, socket, rooms: this.rooms, server: this });
		});

		socket.on('handshake', (callback: UserCallback) => {
			console.info(`Handshake received from ${socket.id}`);
			const opts = {
				socket,
				users: this.users,
				server: this,
				callback,
			};

			handleReconnect(opts);
			handleGenerateNewUser(opts);

			const socketIdList = this.users.GetAllSocketIds();
			this.SendMessage(
				'user_connected',
				socketIdList.filter((id) => id !== socket.id),
				socketIdList,
			);
		});

		socket.on('disconnect', () => {
			handleDisconnect({ users: this.users, socket, server: this });
			handleLeaveRoom({ rooms: this.rooms, socket, server: this });
		});
	};

	SendMessage = (name: string, users: string[], payload?: Object) => {
		console.info(`Sending message ${name} to ${users.length} users`);
		users.forEach((id) =>
			payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name),
		);
	};
}
