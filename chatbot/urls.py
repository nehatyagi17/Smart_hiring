from django.urls import path
from .views import HRChatbotView

urlpatterns = [
    path("ask/", HRChatbotView.as_view()),
]
