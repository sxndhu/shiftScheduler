from django.db import models
from django.contrib.auth.models import User 
from datetime import timedelta

class Shift(models.Model):
    # name = models.CharField(max_length = 100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    break_hours = models.FloatField(default=0.0)
    assigned_to = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'shifts')
    is_approved = models.BooleanField(default=False)
    date = models.DateField(null=True, blank=True)
    total_hours = models.FloatField(default=0.0)

    def calculate_total_hours(self):
        duration = (self.end_time - self.start_time).total_seconds() / 3600
        return round(duration - self.break_hours, 2)

    def __str__(self):
        return f"{self.name} - {self.assigned_to.username} ({self.date})"
         