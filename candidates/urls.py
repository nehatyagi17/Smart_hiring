from django.urls import path
from .views import ResumeUploadView ,RankedCandidatesView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('ranked/<int:job_id>/', RankedCandidatesView.as_view(), name='ranked-candidates'),
]
