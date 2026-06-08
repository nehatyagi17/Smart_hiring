from django.urls import path
from .views import (
    CreateInterviewSlotView,
    AvailableSlotsView,
    BookSlotView
)

urlpatterns = [
    path('slots/create/', CreateInterviewSlotView.as_view()),
    path('slots/<int:job_id>/', AvailableSlotsView.as_view()),
    path('book/<int:slot_id>/', BookSlotView.as_view()),
]
