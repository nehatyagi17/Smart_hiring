from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ResumeUploadSerializer
from .models import CandidateResume
from .utils import extract_text
from accounts.permissions import IsCandidate
from .ai_engine import calculate_score
from jobs.models import Job
from accounts.permissions import IsHR
from .serializers import ResumeScoreSerializer

class ResumeUploadView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume = serializer.save(candidate=request.user)
            text = extract_text(resume.resume_file.path)
            resume.extracted_text = text
            resume.save()

            return Response(
                {"message": "Resume uploaded and processed successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeUploadView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume = serializer.save(candidate=request.user)

            text = extract_text(resume.resume_file.path)
            resume.extracted_text = text

            job_text = resume.job.description
            score = calculate_score(text, job_text)

            resume.score = score
            resume.status = 'SHORTLISTED' if score >= 60 else 'REJECTED'
            resume.save()

            return Response({
                "message": "Resume processed successfully",
                "score": score,
                "status": resume.status
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RankedCandidatesView(APIView):
    permission_classes = [IsHR]

    def get(self, request, job_id):
        resumes = CandidateResume.objects.filter(
            job_id=job_id
        ).order_by('-score')

        serializer = ResumeScoreSerializer(resumes, many=True)
        return Response(serializer.data)