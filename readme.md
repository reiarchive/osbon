
# Osis Bot Election

OSBON (Osis Bot Election) aims to transform the traditional way of electing the OSIS leader in schools to a digital system using the WhatsApp application. This project involves developing a WhatsApp Bot that allows students to vote for their OSIS leader through their mobile devices, replacing the manual and time-consuming process. The application enables students to cast their vote remotely without having to be physically present at the polling station. The project aims to streamline the election process and improve accessibility for students.

## Usage

- Import students data to nis model with fields NIS and NAMA

- Import candidates data to kandidats model with field picture (base64 encoding of the image), name, visi, and misi

- Import admins data to admins model with field number

- Change database connection on .env

- (Optional) Change the response messages on .env

Run this command and you're ready to go

```bash
$ npm run start
```