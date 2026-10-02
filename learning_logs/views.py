import os
import re
from django.shortcuts import render, redirect, get_object_or_404  # <-- Added get_object_or_404 here
from django.contrib.auth.decorators import login_required
from django.http import Http404
from better_profanity import profanity
from django.db.models.functions import Lower
from .models import Topic, Entry
from .forms import TopicForm, EntryForm
from django.db.models import Count, Max, Func
from django.conf import settings


# Define the absolute path to your banned words file
BANNED_WORDS_FILE = os.path.join(settings.BASE_DIR, 'learning_logs', 'banned_words.txt')

#  pip install better-profanity
# 1. Create a helper class so Django can talk to Postgres's capitalization function
class InitCap(Func):
    function = 'INITCAP'


def index(request):
    """Home page for Learning Log"""
    return render(request, 'learning_logs/index.html')

@login_required
def topics(request):
    """Show all topics or only user topics."""
    show_all = request.GET.get('show') == 'all'

    # Keeps your 'Add Topic' link logic working perfectly
    user_topics = Topic.objects.filter(owner=request.user).values_list('text', flat=True)

    if show_all:
        # 1. Group by text and find the Max ID for each unique topic name that STILL exists.
        # This prevents the "disappearing act" if one specific user deletes their copy!
        valid_topic_data = (
            Topic.objects.filter(is_public=True)
            .annotate(proper_text=InitCap('text'))
            .values('proper_text')
            .annotate(
                real_id=Max('id'),
                total_interest=Count('owner')
            )
            .order_by('proper_text')
        )

        # 2. Rebuild the list of objects for the template to read safely
        topics = []
        for data in valid_topic_data:
            # Create a temporary topic object that has the correct ID, text, and total interest count
            t = Topic(id=data['real_id'], text=data['proper_text'])
            t.num_users = data['total_interest']
            topics.append(t)

        # 3. Sort alphabetically from A to Z
        topics = sorted(topics, key=lambda t: t.text.lower())
    else:
        # Private list stays sorted by when they were added
        topics = Topic.objects.filter(owner=request.user).order_by('date_added')

    context = {
        'topics': topics,
        'show_all': show_all,
        'user_topics': user_topics
    }
    return render(request, 'learning_logs/topics.html', context)



@login_required
def topic(request, topic_id):
    """Show one topic and all entries"""
    topic = Topic.objects.get(id=topic_id)
    if topic.owner != request.user:
        return render(request, 'learning_logs/wrong_topic.html')
    entries = topic.entry_set.order_by('-date_added')
    context = {'topic': topic, 'entries': entries}
    return render(request, 'learning_logs/topic.html', context)



def load_custom_banned_words():
    """Reads the external text file and returns a clean, memory-efficient set."""
    banned_set = set()
    if os.path.exists(BANNED_WORDS_FILE):
        with open(BANNED_WORDS_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                # Ignore empty lines or comments starting with '#'
                if word and not word.startswith('#'):
                    banned_set.add(word)
    return banned_set

# Load the set once into memory when the server starts
CUSTOM_BANNED_WORDS = load_custom_banned_words()


@login_required
def new_topic(request):
    if request.method != 'POST':
        form = TopicForm()
    else:
        form = TopicForm(data=request.POST)
        if form.is_valid():
            new_topic = form.save(commit=False)
            new_topic.owner = request.user

            # --- EXPANDED PROFANITY & CUSTOM CHECK START ---
            # Convert text to lowercase and strip punctuation to catch hidden words
            clean_text = new_topic.text.lower()
            words_in_text = set(re.findall(r'\b\w+\b', clean_text))

            # Check if any user word intersects with your custom banned words set
            has_custom_banned_word = not words_in_text.isdisjoint(CUSTOM_BANNED_WORDS)
            has_letters = any(char.isalpha() for char in new_topic.text)

            # Run both the library check and your custom list check
            if has_custom_banned_word or profanity.contains_profanity(new_topic.text) or not has_letters:
                new_topic.is_public = False  # Keep it private to this user
            else:
                new_topic.is_public = True   # Allowed on the "Show All" list
            # --- EXPANDED PROFANITY & CUSTOM CHECK END ---

            new_topic.save()
            return redirect('learning_logs:topics')

    context = {'form': form}
    return render(request, 'learning_logs/new_topic.html', context)

@login_required
def new_entry(request, topic_id):
    topic = Topic.objects.get(id=topic_id)
    if request.method != 'POST':
        form = EntryForm()
    else:
        form = EntryForm(request.POST, request.FILES)
        if form.is_valid():
            new_entry = form.save(commit=False)
            new_entry.topic = topic
            new_entry.save()
            return redirect('learning_logs:topic', topic_id=topic_id)
    context = {'topic': topic, 'form': form}
    return render(request,'learning_logs/new_entry.html', context)

@login_required
def edit_entry(request, entry_id):
    entry = Entry.objects.get(id=entry_id)
    topic = entry.topic
    if topic.owner != request.user:
        return render(request, 'learning_logs/wrong_topic.html')

    if request.method != 'POST':
        form = EntryForm(instance=entry)
    else:
        form = EntryForm(request.POST, request.FILES, instance=entry)
        if form.is_valid():
            form.save()
            return redirect('learning_logs:topic', topic_id=topic.id)
    context = {'entry': entry, 'topic': topic, 'form': form}
    return render(request, 'learning_logs/edit_entry.html', context)

@login_required
def add_existing_topic(request, text):
    """Add an existing community topic to the current user's list."""
    # Check if the user already has this topic
    if Topic.objects.filter(owner=request.user, text__iexact=text).exists():
        # Already tracking, just redirect
        return redirect('learning_logs:topics')

    # Otherwise, create a new topic for this user
    new_topic = Topic(text=text, owner=request.user)
    new_topic.save()
    return redirect('learning_logs:topics')

def wrong_topic(request):

    return render(request, 'learning_logs/wrong_topic.html')


@login_required
def delete_topic(request, topic_id):
    # 1. Safely grab the topic the user wants to delete
    topic = get_object_or_404(Topic, id=topic_id, owner=request.user)

    # 2. Check if ANY other user in the system has a topic with the exact same text
    other_users_have_this = Topic.objects.filter(text__iexact=topic.text).exclude(id=topic.id).exists()

    if other_users_have_this:
        # If someone else is using it, ONLY delete this user's row.
        # The topic will stay safely visible in the "Show All" list because the other user's row still exists!
        topic.delete()
    else:
        # If absolutely nobody else has this topic on their list, we have a choice:
        # Option A: If you want it to completely disappear from the global list when the last person deletes it:
        topic.delete()

        # Option B (RECOMMENDED): If you want it to STAY on the global list forever as an option for others,
        # do NOT delete it. Instead, reassign it to a system account or keep it available.
        # For now, topic.delete() will clean it up if no one is using it.

    return redirect('learning_logs:topics')

def props(request):
    return render(request, 'learning_logs/props.html')

@login_required
def delete_entry(request, entry_id):
    """Delete an existing entry."""
    entry = get_object_or_404(Entry, id=entry_id)
    topic = entry.topic

    # Optional: Check that the topic belongs to the current user
    # if topic.owner != request.user:
    #     raise Http404

    if request.method == 'POST':
        entry.delete()

    return redirect('learning_logs:topic', topic_id=topic.id)




