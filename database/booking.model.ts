import mongoose, { Schema, Document, Model } from "mongoose";
import Event from "./event.model";

/**
 * TypeScript interface for Booking document
 * Extends mongoose Document to include type-safe properties
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 * Defines the structure and validation rules for booking documents
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents booking creation for non-existent events
 */
BookingSchema.pre("save", async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified("eventId")) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(new Error(`Error validating event: ${error.message}`));
      }
      return next(new Error("Error validating event"));
    }
  }

  next();
});

/**
 * Create index on eventId for faster queries
 * Improves performance when fetching bookings by event
 */
BookingSchema.index({ eventId: 1 });

/**
 * Composite index for event-email combinations
 * Useful for preventing duplicate bookings and faster lookups
 */
BookingSchema.index({ eventId: 1, email: 1 });

/**
 * Booking Model
 * Prevents model recompilation in development (Next.js hot reload)
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
