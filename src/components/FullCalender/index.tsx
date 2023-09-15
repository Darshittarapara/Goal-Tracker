import React, { useState } from 'react';
import {
    formatDate,
} from '@fullcalendar/core';
import "./Fullcalender.scss";
import "@fullcalendar/common/main.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router';
import "./Fullcalender.scss"
import moment from 'moment';
import { Strings } from 'config/Strings';
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

interface EventDataType {
    start: string;
    end: string;
    id: string;
    title: string;
    display?: string;
    backgroundColor: string
}
interface CalenderProps {
    data: EventDataType[]
    hasSelected?: boolean,
    onDateSelected?: (date: string) => void
}
export function createEventId() {
    return String(eventGuid++)
}
const Calender: React.FC<CalenderProps> = ({
    data,
    hasSelected = false,
    onDateSelected
}) => {
    const [weekendsVisible] = useState(true);

    const handleDateSelect = (selectInfo: any) => {
        const currentDate = moment(new Date()).format("YYYY-MM-DD")
        if (!moment(selectInfo.startStr).isSameOrBefore(currentDate)) {
            Swal.fire({
                title: "",
                text: Strings.pleaseSelectedPreviousDateFromToday,
                icon: "info"
            })
            return
        }

        if (onDateSelected) {
            onDateSelected(selectInfo.startStr)
        }
        //  calendarApi.unselect(); // clear date selection
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
                selectLongPressDelay={1}
                initialView='dayGridMonth'
                editable={true}
                themeSystem='cosmo'
                firstDay={1}
                selectable={true}
                selectMirror={true}
                weekends={weekendsVisible}
                events={data}
                //  height="600px"
                select={handleDateSelect}
                eventContent={renderEventContent}
                // eventClick={handleEventClick}
                selectAllow={(e) => {
                    if (hasSelected) {
                        return true
                    }
                    return false;
                }}
            />
        </div>
    );
}

export default Calender;
