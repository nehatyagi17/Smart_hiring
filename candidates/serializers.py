from rest_framework import serializers
from .models import CandidateResume

class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateResume
        fields = ('id', 'job', 'resume_file')


class ResumeScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateResume
        fields = (
            'candidate',
            'job',
            'score',
            'status',
            'uploaded_at'
        )
