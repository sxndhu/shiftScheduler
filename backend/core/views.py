from django.shortcuts import render
from rest_framework import viewsets, mixins, permissions
from django.contrib.auth.models import User
from .models import Shift
from .serializers import RegisterSerializer, AdminUserCreationSerializer, UserSerializer, ShiftSerializer
from .permissions import IsAdminUser, IsAdminOrReadOnlyForAssignedShift, IsNotAuthenticated


class RegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsNotAuthenticated]

class AdminUserCreateViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserCreationSerializer
    permission_classes = [IsAdminUser]

class EmployeeDeleteViewSet(mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.filter(is_staff = False)
    permission_classes = [IsAdminUser]
    lookup_field = 'username'

class UserListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAdminOrReadOnlyForAssignedShift]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Shift.objects.all()
        return Shift.objects.filter(assigned_to = user)


