import { type Socket as IOSocket } from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'

export type Socket = IOSocket <DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export type UserCallback = (uid:string, users: string[]) => void
