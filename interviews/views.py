from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import InterviewSlot, Interview
from .serializers import InterviewSlotSerializer
from accounts.permissions import IsHR, IsCandidate

# HR creates slots
class CreateInterviewSlotView(APIView):
    permission_classes = [IsHR]

    def post(self, request):
        serializer = InterviewSlotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# View available slots (HR & Candidate)
class AvailableSlotsView(APIView):
    def get(self, request, job_id):
        slots = InterviewSlot.objects.filter(
            job_id=job_id,
            is_booked=False
        )
        serializer = InterviewSlotSerializer(slots, many=True)
        return Response(serializer.data)


# Candidate books a slot
class BookSlotView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, slot_id):
        try:
            slot = InterviewSlot.objects.get(id=slot_id, is_booked=False)
        except InterviewSlot.DoesNotExist:
            return Response({"error": "Slot not available"}, status=400)

        slot.is_booked = True
        slot.save()

        Interview.objects.create(
            candidate=request.user,
            job=slot.job,
            slot=slot
        )

        return Response(
            {"message": "Interview scheduled successfully"},
            status=201
        )
from .email_service import send_interview_email

class BookSlotView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, slot_id):
        try:
            slot = InterviewSlot.objects.get(id=slot_id, is_booked=False)
        except InterviewSlot.DoesNotExist:
            return Response({"error": "Slot not available"}, status=400)

        slot.is_booked = True
        slot.save()

        interview = Interview.objects.create(
            candidate=request.user,
            job=slot.job,
            slot=slot
        )

        send_interview_email(interview)

        return Response(
            {"message": "Interview scheduled & email sent"},
            status=201
        )
