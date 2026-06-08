from django.core.mail import EmailMessage
from .utils import generate_ics

def send_interview_email(interview):
    subject = "Interview Scheduled"
    body = f"""
Hello {interview.candidate.email},

Your interview for the position "{interview.job.title}" has been scheduled.

Date: {interview.slot.date}
Time: {interview.slot.start_time} - {interview.slot.end_time}

Please find the calendar invite attached.
"""

    email = EmailMessage(
        subject,
        body,
        to=[interview.candidate.email],
    )

    ics_content = generate_ics(interview)
    email.attach('interview.ics', ics_content, 'text/calendar')

    email.send()
