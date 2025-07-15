from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsAdminOrReadOnlyForAssignedShift(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.is_staff:
            return True
        
        return request.method in permissions.SAFE_METHODS or request.method == 'POST'

    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.method in permissions.SAFE_METHODS:
            return obj.assigned_to == request.user
        return False

class IsNotAuthenticated(permissions.BasePermission):
    """
    Allows access only to unauthenticated users.
    """

    def has_permission(self, request, view):
        return not request.user or not request.user.is_authenticated