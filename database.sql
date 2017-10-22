CREATE TABLE "todolist"(
	"id" serial PRIMARY KEY,
	"tasks" VARCHAR(100),
	"priority" VARCHAR (80),
	"startdate" date,
	"duedate" date,
	"status" VARCHAR (50)
);

INSERT INTO "todolist" ("tasks", "priority", "startdate", "duedate", "status")
VALUES ('Finish weekend project 3', 'HIGH','10/20/2017', '10/20/2017', 'In Progress');
