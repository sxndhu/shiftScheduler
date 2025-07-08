from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, AdminUserCreateViewSet, EmployeeDeleteViewSet, UserListViewSet, ShiftViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename = 'register')
router.register(r'admin-create-user', AdminUserCreateViewSet, basename = 'admin-create-user')
router.register(r'employees', EmployeeDeleteViewSet, basename = 'employee-delete')
router.register(r'users', UserListViewSet, basename = 'user-list')
router.register(r'shifts', ShiftViewSet, basename = 'shift')

urlpatterns = [
    path('', include(router.urls)),
]