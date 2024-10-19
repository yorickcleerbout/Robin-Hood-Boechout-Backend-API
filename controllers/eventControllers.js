import axios from 'axios';
import config from '../config.js';

import { formatDateTime } from '../helpers/utils/formatDateTime.js';

export const getEvents = async (req, res, next) => {
    try {
        
        let calendarId = null;
        switch (req.params.slug) {
            case 'luchtdoelschieten':
                calendarId = config.googleCalendarConfig.luchtdoelschietenId;
                break;
            case 'robin-hood-boechout':
                    calendarId = config.googleCalendarConfig.robinHoodBoechoutId;
                    break;
            case 'antwerpse-federatie':
                    calendarId = config.googleCalendarConfig.antwerpseFederatieId;
                    break;
            case 'boogsport-vlaanderen':
                let bsvEvents = await getBSVEvents();
                return res.status(200).send(bsvEvents);
            default:
                break;
        }

        const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${new Date().toISOString()}&key=${config.googleCalendarConfig.apiKey}`);
        if (!response.data.items) return [];

        let events = [];
        response.data.items.forEach(event => {

            let [ startDate, startTime ] = formatDateTime(event.start.dateTime);
            let [ endDate, endTime ] = formatDateTime(event.end.dateTime);

            events.push({
                start: {
                    date: startDate,
                    time: startTime
                },
                end: {
                    date: endDate,
                    time: endTime
                },
                details: {
                    title: event.summary,
                    description: event.description
                },
                location: event.location,
                link: event.htmlLink
            });
        
        });

        res.status(200).send(events);

        
    } catch (error) {
      res.status(400).send(error.message);
    }
};

async function getBSVEvents() {
    const response = await axios.get('https://www.boogsport.vlaanderen/wp-json/tribe/events/v1/events');
    let bsvEvents = [];
    response.data.events.forEach(event => {
        bsvEvents.push({
            start: {
                date: `${event.start_date_details.day}/${event.start_date_details.month}/${event.start_date_details.year}`,
                time: `${event.start_date_details.hour}u${event.start_date_details.minutes}`
            },
            end: {
                date: `${event.end_date_details.day}/${event.end_date_details.month}/${event.end_date_details.year}`,
                time: `${event.end_date_details.hour}u${event.end_date_details.minutes}`
            },
            details: {
                title: event.title.replaceAll('&#8211;', '-'),
            },
            location: `${event.venue.venue}, ${event.venue.address}, ${event.venue.zip} ${event.venue.city}, ${event.venue.country}`,
            link: event.url

        })
    });
    return bsvEvents;
}