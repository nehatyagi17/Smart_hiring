from datetime import datetime
from uuid import uuid4

def generate_ics(interview):
    start = datetime.combine(interview.slot.date, interview.slot.start_time)
    end = datetime.combine(interview.slot.date, interview.slot.end_time)

    uid = uuid4()

    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HR Agent//Interview//EN
BEGIN:VEVENT
UID:{uid}
DTSTAMP:{start.strftime('%Y%m%dT%H%M%S')}
DTSTART:{start.strftime('%Y%m%dT%H%M%S')}
DTEND:{end.strftime('%Y%m%dT%H%M%S')}
SUMMARY:Interview for {interview.job.title}
DESCRIPTION:Interview scheduled via HR Agent
END:VEVENT
END:VCALENDAR
"""
    return ics_content
