import Users from './Users'
import type ServerSocket from '../socket'
import { Socket, UserCallback } from '../interfaces'

interface HandleUsers {
  socket: Socket
  users: Users
  server: ServerSocket
  callback: UserCallback
}

interface HandleDisconnect {
  socket: Socket
  users: Users
  server: ServerSocket
}

const handleUsers = {
  handleDisconnect: (
    {socket, users, server} : HandleDisconnect
  ) => {
    console.info(`Disconnect received from ${socket.id}`)
    const uid = users.GetUidFromSocketId(socket.id)

    if(uid) {
      users.Delete(uid)
      const socketIdList = users.GetAllSocketIds()
      server.SendMessage('user_disconnected', socketIdList, socket.id)
    }
  },
  handleReconnect: (
    {socket, users, callback}: HandleUsers
  ) => {
    const reconnected = Object.values(users.users).includes(socket.id)
    if (reconnected) {
      console.info(`User ${socket.id} reconnected`)
      const uid = users.GetUidFromSocketId(socket.id)

      const socketIdList = users.GetAllSocketIds()

      if(uid){
        console.info("Sending callback to reconnect")
        callback(uid, socketIdList)
      }
    }
  },
  handleGenerateNewUser: (
    {socket, users, callback}: HandleUsers
  ) => {
    const uid = users.Create(socket)
    const socketIdList = users.GetAllSocketIds()

    console.info(`Sending callback for handshake...`)
    callback(uid, socketIdList)
  }
}

export default handleUsers
