from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Job
from .serializers import JobSerializer
from accounts.permissions import IsHR

class JobCreateView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        jobs = Job.objects.all().order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)


class JobDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        serializer = JobSerializer(job)
        return Response(serializer.data)
