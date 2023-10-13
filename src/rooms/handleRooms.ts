import Rooms from './Rooms';
import type ServerSocket from '../socket';
import { Socket } from '../interfaces';

interface HandleRooms {
	socket: Socket;
	rooms: Rooms;
	rid: string;
	server: ServerSocket;
}

function disconnectUserFromRoom({
	socket,
	rooms,
	server,
}: Omit<HandleRooms, 'rid'>) {
	console.info('user leave:', socket.id);
	const rid = rooms.GetUserRoom(socket) || '';
	if (rooms.HasRoom(rid)) {
		socket.leave(rid);
		rooms.DeleteUserFromRoom(rid, socket.id);

		const usersInRoom = Array.from(rooms?.GetAllUsersFromRoom(rid) || []);
		if (!usersInRoom.length)
			rooms.Delete(rid); // delete room if there are nobody in the room
		else server.io.to(rid).emit('leave_room', socket.id); // emit disconnected socket id to users in the room
	}
}

const handleRooms = {
	handleCreateRoom: ({
		socket,
		rooms,
		server,
	}: Omit<HandleRooms, 'rid'>): void => {
		// if user is already connected in a room, disconnect him
		disconnectUserFromRoom({ socket, rooms, server });

		const rid = rooms.Create();
		rooms.Join(socket, rid);
		const usersInRoom = Array.from(rooms?.GetAllUsersFromRoom(rid) || []);

		server.io.to(rid).emit('join_room', usersInRoom, rid);
	},

	handleJoinRoom: ({ rid, socket, rooms, server }: HandleRooms): void => {
		// if user is already connected in a room, disconnect him
		disconnectUserFromRoom({ socket, rooms, server });

		if (rooms.HasRoom(rid)) rooms.Join(socket, rid);
		else {
			rooms.Create(rid);
			rooms.Join(socket, rid);
		}
		const usersInRoom = Array.from(rooms?.GetAllUsersFromRoom(rid) || []);
		server.io.to(rid).emit('join_room', usersInRoom, rid);
	},

	handleLeaveRoom: (args: Omit<HandleRooms, 'rid'>): void => {
		disconnectUserFromRoom(args);
	},
};

export default handleRooms;
