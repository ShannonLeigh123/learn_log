<div align="center">

| NotableNotes View | Edit Entry View |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/1c90f188-8729-4712-afaf-9ffa3975481e" width="380"> | <img src="https://github.com/user-attachments/assets/f48b4f6f-c34b-467d-89b3-b356eff53866" width="380"/> |

</div>

# NotableNotes

A personal interests log built with Django that helps you track what you’re learning, organize notes by topic, and review your progress over time. It’s simple, clean, and designed for long‑term growth.

## 🚀 Live Demo
Explore the application live here: **[NotableNotes on Render](https://learn-log-73sc.onrender.com)**

---

## ✨ Features
* **Full CRUD Functionality:** Create, edit, and delete personal learning notes smoothly.
* **Topic Organization:** Categorize and structure your logs based on custom subjects.
* **Progress Tracking:** Automatically apply date-stamped logs to trace your learning curve.
* **Minimalist UI:** Built with speed in mind for fluid, distraction-free note-taking.
* **Admin Management:** Integrated Django administration panel for easy database monitoring.

## 🛠️ Tech Stack
* **Backend:** Python 3.x, Django
* **Database:** SQLite (Default dev environment) or PostgreSQL
* **Frontend:** HTML5, CSS3
* **Version Control:** Git & GitHub

---

## 💻 Installation

Follow these steps to set up and run NotableNotes locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShannonLeigh123/learn_log.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd learn_log
   ```

3. **Create and activate a virtual environment:**
   * **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```
   Open your browser and navigate to `http://127.0.0`.

---

## 💡 Usage

1. **Create an Account:** Sign up for a secure, personal profile directly through the login gate.
2. **Add Topics:** Log custom high-level subjects or technical frameworks you are currently exploring.
3. **Log Progress:** Append detailed entries under each topic to archive your research notes, stack traces, or learning goals over time.

---

## 📂 Project Structure
* `accounts/` — User account authorization and user logic definitions.
* `learning_logs/` — The primary Django application containing your views, templates, and note models.
* `ll_project/` — Global project configuration files, settings, and root URL configurations.
* `manage.py` — The core Django management script wrapper.
* `requirements.txt` — Declared external project dependencies.

---

## 🔮 Future Improvements
* Add an interactive tagging system to cross-reference entries.
* Implement custom file attachments and image uploads for notes.
* Introduce a native dark mode toggle for night owl coding sessions.
