import Link from "next/link";
import Image from "next/image";

const EventCard = ({ title, image, slug, location, date, time}) => {
    return (
        <Link href={`/events/${slug}`} className="event-card">

        <Image src={image} alt={title} width={410} height={300} className="poster"/>

            <div className="flex flex-row gap-2 mb-3 mt-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                <p>{location}</p>
            </div>

            <p className="title font-bold">{title}</p>

            <div className="datetime flex flex-row gap-3">
                <div className="flex flex-row gap-1">
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                    <p>{date}</p>
                </div>
                <div className="flex flex-row gap-1">
                    <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard;