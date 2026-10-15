import CategoryFilter from '@/app/components/CategoryFilter';
import {getEvents} from '@/lib/events';

export const metadata={
    title: 'Events'
};

export default async function eventsPage() {
    const events = await getEvents();

    return(
        <>
        <h1>Events</h1>
        <CategoryFilter events={events}/>
        </>
    )
}