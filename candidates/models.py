from django.db import models
from accounts.models import User
from jobs.models import Job

class CandidateResume(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume_file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.email} - {self.job.title}"


class CandidateResume(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SHORTLISTED', 'Shortlisted'),
        ('REJECTED', 'Rejected'),
    )

    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume_file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField()
    score = models.FloatField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
