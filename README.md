# TutorPlus-Summer-Release

### A registration web application for VMS Tutoring

## Upcoming Summer Updates

- Introduce a new functionality for students to be able to unregister from sessions by themselves
- Improve and optimize student page by providing more information about tutors and sessions
- Immplement a more secure and user friendly login process with the option to change passwords
- Enhanced navigation for each entity and to add an element of discretion among admins, tutors, and students

## The problem

The current 'VMS Tutoring' lacks a structured registration or appointment system. Tutors do not have certainty about the number of students attending their session. Since tutors are directly appointed and supervised by the professors in charge, they are required to remain available during their scheduled times, even if nostudents show up. This gets quite inefficient and time-comsuming for most of the days.

## The proposed solution

The proposed solution involves three main parties: the admin, tutors, and students. The admin oversees the tutors, while the tutors take charge of managing their own schedules and registrations. Students can easily view the available time slots of each tutor and register to join their preferred sessions. The entire process is regularly updated using CRUD operations, ensuring accuracy and efficiency throughout the system.

## Features

- Admin and Tutors will have their own login info
- Admin can assign and delete Tutors
- Admin can see all the Tutors and Students' registration in action
- Tutors will only be able to see the registration for their respective sessions only
- Tutors will have permission to manage their sessions under supervision (CRUD)
- Students will be able to see all the available tutors, and their availablity
- Students will be able to add their name and student ID to register for a session
- At the end of each session, tutors will be required to delete the registration list for the completed session
- Tutors are required to maintain the cycle of creating, updating, and deleting for continuity

As much as we'd like to implement some automation here and there, there is no certainty that this could be realistically achieved in the early stages of the project.

## Authors (Group Members)

- [[6411271] Lynn Thit Nyi Nyi](https://github.com/LynnT-2003)
- [[6411325] Aung Cham Myae](https://github.com/u6411325)
- [[6410381] Tanat Arora](https://github.com/Tanat04)

## Tech Stack

**Client:** React, Bootstrap, Chakra-UI

**Server:** MongoDB, Node, Express / Next

#### Note: We plan to either use the traditional MERN techstack (MongoDB, Express, React, Node) or use Next.js instead of Express for the backend
