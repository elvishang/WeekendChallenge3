# Weekend Challenge 3: Create a TODO App
This weekend is all about showing us that you have a handle on each of the different parts of the full stack. For this weekends challenge, you are going to create a 'TO DO' application. This is the type of application that is very common to tackle when learning a new language, which makes it extremely valuable to work through for the first time, since chances are good that at some point in your career you will tackle this type of application, but in another language. 

Table Setup
--------
```SQL
CREATE TABLE "todolist"(
	"id" serial PRIMARY KEY,
	"tasks" VARCHAR(100),
	"priority" VARCHAR (80),
	"startdate" date,
	"duedate" date,
	"status" VARCHAR (50)
);

--data to insert sample
INSERT INTO "todolist" ("tasks", "priority", "startdate", "duedate", "status")
VALUES ('Finish weekend project 3', 'High','10/20/2017', '10/20/2017', 'In Progress');
```


Routers
------
Router:
* '/todolist':
    * GET - /, returns {id (int) ,tasks (str),priority (str), startdate(date),duedate(date), status (str)}
    * POST - /, accepts {id (int) ,tasks (str),priority (str), startdate(date),duedate(date), status (str)}
    * GET - /completed, sorts 'complete' tasks DESC
    * GET - /active, shows all 'active' tasks to DOM
    * PUT - /:id, updates {id (int) ,tasks (str),priority (str), startdate(date),duedate(date), status (str)} with row id
    * GET - /:id, returns tasks by ID
    * DELETE - /:id, deletes tasks by ID
    * DELETE - /:id/clearcomplete, deletes all 'Complete' tasks
    * DELETE - /:id/clearall, deletes all data
    * DELETE - /:id/clearincomplete, deletes all 'In Progress' and 'Not Started' tasks


## Topics Covered
- JavaScript
- jQuery
- node.js
- SQL/Databases
- HTML/CSS
- Express
- Bootstrap/Datepicker
- Moment

## Assignment

[X] Create a front end experience that allows a user to create a task.

[X] When the task is created, it should be stored inside of a database (SQL)

[X] Whenever a task is created the front end should refresh to show all tasks that need to be completed.

[X] Each task should have an option to 'Complete' or 'Delete'.

[X] When a task is complete, its visual representation should change on the front end (for example, the background of the task container could change from gray to green, as well as the complete option 'checked off'. Each of these are accomplished in CSS, but will need to hook into logic to know whether or not the task is complete)

[X] Whether or not a task is complete should also be stored in the database.

[X] Deleting a task should remove it both from the Front End as well as the Database.

## Hard Mode
[X] In whatever fashion you would like, create an 'are you sure: yes / no' option when deleting a task.

[X] Use jQuery to add animation to your page when you add or remove an item to the list.

## Pro Mode
[X] Publish your app to Heroku.

[X] Adjust the logic so that completed tasks are brought to the bottom of the page, where the remaining tasks left to complete are brought to the top of the list.

[X] Add a due date to your tasks and put the items which need to be completed next at the top of the page. Highlight overdue tasks in red.
