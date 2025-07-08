from django.db import models
from django.contrib.auth.models import User 

class Shift(models.Model):
    name = models.CharField(max_length = 100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    assigned_to = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'shifts')

    def __str__(self):
        return f"{self.name} - {self.assigned_to.username}"
         