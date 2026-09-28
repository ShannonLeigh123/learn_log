"""Defines URL patterns for learning_logs app"""


from django.urls import path
from . import views

app_name = 'learning_logs'

urlpatterns = [
    path('', views.index, name='index'),
    path('topics/', views.topics, name='topics'),
    path('topics/<int:topic_id>/', views.topic, name='topic'),
    path('new_topic/', views.new_topic, name='new_topic'),
    path('new_entry/<int:topic_id>/', views.new_entry, name='new_entry'),
    path('edit_entry/<int:entry_id>/', views.edit_entry, name='edit_entry'),
    path('wrong_topic/', views.wrong_topic, name='wrong_topic'),
    path('add_existing_topic/<str:text>/', views.add_existing_topic, name='add_existing_topic'),
    path('delete_topic/<int:topic_id>/', views.delete_topic, name='delete_topic'),
    path('props/', views.props, name='props'),
    path('delete_entry/<int:entry_id>/', views.delete_entry, name='delete_entry'),
]


