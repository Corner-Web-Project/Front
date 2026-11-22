import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { apiUrl } from "../api/config";

import "../css/schedule.css";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay: boolean;
}

export default function Schedule() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(apiUrl("/api/calendar"))
            .then((res) => res.json())
            .then((data) => {
                console.log("Notion 데이터:", data);
                setEvents(data);
            })
            .catch((error) => {
                console.error("캘린더 데이터 오류:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <main className="schedule-page">
            <div className="schedule-container">

                <div className="schedule-header">
                    <div>
                        <h1>Schedule</h1>
                        <p>구석방에서 관리하는 멤버들의 일정입니다.</p>
                    </div>
                </div>

                <section className="calendar-wrapper">
                    {loading ? (
                        <div className="calendar-loading">
                            일정을 불러오는 중...
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            height="auto"
                            dayMaxEvents={3}
                            headerToolbar={{
                                left: "",
                                center: "title",
                                right: "prev,next today",
                            }}
                            buttonText={{
                                today: "오늘",
                            }}
                        />
                    )}
                </section>

            </div>
        </main>
    );
}