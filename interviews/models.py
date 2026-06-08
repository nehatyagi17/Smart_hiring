from django.db import models
from accounts.models import User
from jobs.models import Job

class InterviewSlot(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.job.title} | {self.date} {self.start_time}"


class Interview(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    slot = models.OneToOneField(InterviewSlot, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField(auto_now_add=True)
