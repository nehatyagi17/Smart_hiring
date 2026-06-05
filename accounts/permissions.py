from rest_framework.permissions import BasePermission

class IsHR(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'HR'


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CANDIDATE'


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'EMPLOYEE'
