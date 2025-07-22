# 🕒 Shift Management App

A full-stack web application for managing employee shifts.  
Supports **Admins** and **Employees** with role-based access.

---

## 🚀 Features

### Admin Features:
- Create, edit, and delete shifts
- Assign shifts to employees
- Approve shifts
- Filter shifts by date

### Employee Features:
- View assigned shifts
- Filter shifts by date
- Create personal shift requests

---

## 🖥️ **Tech Stack**

| Frontend | Backend | Database |
|----------|---------|----------|
| React | Django REST Framework | PostgreSQL |

---

## 🛠️ **Setup Instructions**

### 1️⃣ Backend (Django)


cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (optional for admin access)
python manage.py createsuperuser

# Run server
python manage.py runserver

API will be available at:
http://localhost:8000/api/

### 2️⃣ Frontend (React)

cd frontend
npm install
npm start

Frontend will run at:
http://localhost:3000/

🔑 Authentication
- Token-based authentication (DRF Token Auth)

- Store token in localStorage

- Use it for protected API calls

👨‍💻 Author

Angad Singh Sandhu

GitHub: github.com/sxndhu

LinkedIn: https://www.linkedin.com/in/angad277/

🙌 Acknowledgments


Built with Django REST Framework and React


Inspired by the need for simple and effective shift management in small teams at my own workplace.
