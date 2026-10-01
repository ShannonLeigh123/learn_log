<img width="400" alt="homepage_screenshot" src="https://github.com/user-attachments/assets/1c90f188-8729-4712-afaf-9ffa3975481e" />
# NotableNotes (learn_log)

A personal interests log built with Django. This project helps you track what you’re learning, organize notes by topic, and review your progress over time. It’s simple, clean, and designed for long‑term growth.

## Features
- Create, edit, and delete learning notes
- Organize entries by topic or subject
- Timestamped logs for progress tracking
- Clean, minimal UI for fast note-taking
- Django admin panel for managing entries

## Tech Stack
- Python 3.x
- Django
- SQLite (default) or PostgreSQL
- HTML / CSS
- Git & GitHub

## Installation
1. Clone the repository: git clone https://github.com/ShannonLeigh123/learn_log.git 
2. Navigate into the project: cd learn_log
3. Create and activate a virtual environment: python -m venv venv
                                              venv\Scripts\activate

4. Install dependencies: pip install -r requirements.txt
5. Run migrations: python manage.py migrate (or just use py)
6. Start the development server: python manage.py runserver

## Usage
Visit the live application: [NotableNotes on Render](https://learn-log-73sc.onrender.com)
Sign up for a personal account, add new topics, browse your existing entries, and seamlessly track your interests.

## Project Structure
- `accounts/` — user account logic (if enabled)
- `learning_logs/` — main Django app for notes
- `ll_project/` — project configuration files
- `manage.py` — Django management script
- `requirements.txt` — project dependencies

## Future Improvements
- Add search functionality
- Add tagging system
- Add user accounts
- Add file uploads or attachments
- Add dark mode

  
