The project is about barber appointment management. A customer can arrange an appointment at his barbershop, selecting the barber, selecting the hairstyle and date/time.
Barber has a admin panel where he can see the appointments, add date/time availability and set prices and hairstyles…

When a customer finishes the appointment, he is notified via email that the appointment is successfully made and also gets reminder emails 1 day before and on the day of the appointment.

Customer has to add first name, last name, phone number and email when making an appointment, they dont have account they are all guests.

Stack:
Frontend: React, Bootstrap.
Backend: Express
Database: MySQL, host it on somewhere free
Orodja: Postman, Stripe (payment online only test version), axios, nodemailer, brevo, 

Database
User(user_id, email, password_hash, first_name, last_name, phone_num, role, is_available)
Service(service_id, title, price, description, duration)
TimeSlots(slot_id, barber_id, date, time, is_available)
Appointment(appointment_id, barber_id, service_id, c_email, c_phone_num, c_first_name, c_last_name, date, time, status)
