from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Shift

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'is_staff']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User(username = validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class AdminUserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    is_staff = serializers.BooleanField(default = False)

    class Meta:
        model = User
        fields = ['username', 'password', 'is_staff']

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            is_staff = validated_data['is_staff']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ShiftSerializer(serializers.ModelSerializer):
    assigned_to = serializers.SlugRelatedField(slug_field = 'username', queryset = User.objects.all())

    class Meta:
        model = Shift
        fields = ['id', 'name', 'start_time', 'end_time', 'assigned_to']