/**
 * Database Models Export
 * Central export point for all Mongoose models
 * Allows clean imports: import { Event, Booking } from '@/database'
 */

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Export TypeScript interfaces for type safety
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
