from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsEmployee
from .serializers import ChatSerializer
from .models import ChatLog
from .advanced_rag import get_advanced_answer

class HRChatbotView(APIView):
    permission_classes = [IsEmployee]

    def post(self, request):
        serializer = ChatSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        question = serializer.validated_data["question"]

        last_chat = ChatLog.objects.filter(user=request.user).order_by("-created_at").first()
        context = last_chat.question if last_chat else None

        result = get_advanced_answer(question, context)

        ChatLog.objects.create(
            user=request.user,
            question=question,
            answer=result["answer"],
            confidence=result["confidence"]
        )

        return Response({
            "answer": result["answer"],
            "confidence": result["confidence"]
        })
