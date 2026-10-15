import Link from "next/link";
import { notFound } from "next/navigation";
import SaveButton from "@/app/components/SaveButton";
import { getEventById } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import styles from './page.module.css'

export default async function EventPage({params}) {
    const {id} = await params;
    const event = await getEventById(id);

    if(!event){
        notFound()
    }

    return(
        <article>
            <p className={styles.back}>
                <Link href='/events'>Go back to all events</Link>                
            </p>
            <p className={styles.category}>{events.category}</p>
            <h1 className={styles.title}>{event.title}</h1>
            <dl className={styles.facts}>
                <dt>When</dt>
                <dd>
                    <time dateTime={event.startsAt}>{formatEventDate(event.startsAt) }</time>
                </dd>
            <dt>Where </dt>
            <dd>{event.location}</dd>
            <dt>Capacity</dt>
            <dd>{event.capacity} people</dd>
            </dl>
            {event.description && <p className={styles.description}>{event.description}</p>}
            <SaveButton />
        </article>
    )
}