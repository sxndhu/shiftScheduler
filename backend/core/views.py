from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
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
        queryset = Shift.objects.all()

        date_filter = self.request.query_params.get('date', None)

        if user.is_staff:
            if date_filter:
                return queryset.filter(date=date_filter)
            return queryset
        return queryset.filter(assigned_to=user)

    def perform_update(self, serializer):
        shift = serializer.save()
        # Recalculate total hours when shift is updated
        shift.total_hours = shift.calculate_total_hours()
        # Optionally reset approval if you want to force re-approval on changes
        shift.is_approved = False
        shift.save()

    @action(detail=False, methods=['post'], url_path = 'approve-day', permission_classes = [IsAdminUser])
    def approve_day(self, request):
        date = request.data.get('date')
        if not date:
            return Response({'error': 'Please provide date in YYYY-MM-DD format'}, status= status.HTTP_400_BAD_REQUEST)

        shifts = Shift.objects.filter(date = date, is_approved = False)

        if not shifts.exists():
            return Response({'message': 'No pending shifts for approval for this date'}, status = status.HTTP_404_NOT_FOUND)

        for shift in shifts:
            shift.total_hours = shift.calculate_total_hours()
            shift.is_approved = True
            shift.save()

        return Response({'message': 'Shifts approved and total hours logged for employees.'})



