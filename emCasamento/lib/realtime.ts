import { EventEmitter } from "events";

declare global {
  // eslint-disable-next-line no-var
  var __rsvpEmitter: EventEmitter | undefined;
}

export const rsvpEmitter = global.__rsvpEmitter ?? new EventEmitter();

if (!global.__rsvpEmitter) {
  global.__rsvpEmitter = rsvpEmitter;
}