# GoodnessGaseous

A mini stellar encyclopedia built with Django. This project catalogs star types with detailed descriptions and SQL-backed data.

## Features
- Django-based web application
- PostgreSQL database
- Custom star entries and categories
- Clean, cosmic-themed UI

## Tech Stack
- Python 3.x
- Django
- PostgreSQL
- HTML / CSS
- Bootstrap (optional)
- Git & GitHub

## Installation
1. Clone the repository:
   git clone https://github.com/ShannonLeigh123/goodgas.git

2. Navigate into the project:
   cd goodgas

3. Create and activate a virtual environment:
   python -m venv venv
   venv\Scripts\activate

4. Install dependencies:
   pip install -r requirements.txt

5. Set up environment variables in `.env`

6. Run migrations:
   python manage.py migrate

7. Start the development server:
   python manage.py runserver

## Usage
Open your browser and visit:
http://127.0.0.1:8000/

Browse stellar entries, add new ones, or explore categories.

## Future Improvements
- Add search functionality
- Add user accounts
- Add image uploads for star entries
- Expand database with more cosmic objects

