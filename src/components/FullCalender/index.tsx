import React, { useState } from 'react';
import {
    formatDate,
} from '@fullcalendar/core';
import "./Fullcalender.scss";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core'
import { useLocation } from 'react-router';
import "./Fullcalender.scss"
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

interface EventDataType {
    start: string;
    end: string;
    id: string;
    title: string;
    display: string;
    backgroundColor: string
}
interface CalenderProps {
    data: EventDataType[]
}
export function createEventId() {
    return String(eventGuid++)
}
const Calender: React.FC<CalenderProps> = ({
    data
}) => {
    const { pathname } = useLocation();
    const [weekendsVisible] = useState(true);

    const handleDateSelect = (selectInfo: any) => {
        let title = prompt('Please enter a new title for your event');
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };

    const handleEventClick = (clickInfo: any) => {

    };


    const renderEventContent = (eventContent: any) => {
        return (
            <div>
                <b>{eventContent.timeText}</b>
                <i>{eventContent.event.title}</i>
            </div>
        );
    };


    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: ""
                }}
                initialView='dayGridMonth'
                editable={true}
                themeSystem='cosmo'
                firstDay={1}
                selectable={true}
                selectMirror={true}
                weekends={weekendsVisible}
                initialEvents={data}
                //  height="600px"
                select={handleDateSelect}
                eventContent={renderEventContent}
                // eventClick={handleEventClick}
                selectAllow={(e) => {
                    if (pathname.includes("edit")) {
                        return true
                    }
                    return false;
                }}
            />
        </div>
    );
}

export default Calender;
