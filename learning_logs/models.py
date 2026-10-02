from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Topic(models.Model):
    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    # NEW FIELD: Default is True. If flagged by moderation, it becomes False.
    is_public = models.BooleanField(default=True)


    def __str__(self):
        return self.text

class Entry(models.Model):
    """What was learned about the topic"""
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    # NEW FIELD ↓↓↓
    #uploaded_file = models.FileField(upload_to='entry_uploads/', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'entries'
    def __str__(self):
        """Returns a simple string representating the entry"""
        if len(self.text) < 50:
            return f"{self.text}"
        else:
            return f"{self.text[:50]}..."
