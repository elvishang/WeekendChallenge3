console.log('js sourced');

var allTasks;

$(document).ready(readyNow);

function readyNow() {

    console.log('JQ');
    // load existing Tasks on page load
    getTasks();
    // add tasks button click
    $('#addButton').on('click', addButtonClick);
    // delete button confirmation
    $('#viewTasks').on('click', '.delete', confirmDeleteTask);
    // delete
    $('#delete-modal').on('click', '.delete', deleteTask);
    // edit tasks
    $('#viewTasks').on('click', '.editTasks', editTasksFunction);
    // changes status
    $('#viewTasks').on('change', 'tr select', onStatusChange);
    // shoes form when add task button is clicked
    $('#addTaskBtn').on('click', showForm);
    // closes form when cancel button is clicked
    $('#cancelBtn').on('click', closeForm);
    // gets all tasks to DOM on clicked
    $('#allTasksBtn').on('click', getTasks);
    // gets all active tasks to DOM on clicked
    $('#activeBtn').on('click', activeBtnClick);
    // gets all completed tasks to DOM on clicked
    $('#completedBtn').on('click', completedBtnClick);
    // deletes all current completed tasks from db on clicked
    $('#clearComplete').on('click', clearCompleteClick);
    // allows to choose date with calendar
    $('#startDateIn').datetimepicker({
        format: 'MM/DD/YYYY',
        defaultDate: moment()
    }).on('dp.change', function (e) {
        // start date changed
        // update due data min date to start date
        $('#dueDateIn').data('DateTimePicker').minDate(e.date);
    });

    // target due date and set minDate to startDate
    $('#dueDateIn').datetimepicker({
        format: 'MM/DD/YYYY',
        defaultDate: moment(),
        minDate: moment()
    });
}

// Deletes tasks from database and recalls data to DOM
function clearCompleteClick() {
    $('#delete-modal').modal('hide');
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + toDeleteId + '/clearcomplete/'
    }).done(function (response) {
        // remove the selected row instead of getting all the tasks from the server and rendering it again
        $('tr[data-id=' + toDeleteId + ']').fadeOut(500, function () {
            $(this).remove();
            // check to see if there still any tasks left
            // if not then hide the table and show the alert again
            if ($('#viewTasks').find('tr').length === 0) {
                // there no more tasks
                $('.alert-info').removeClass('hidden');
                $('table').addClass('hidden');
            }
        });
        $('#clearComplete').removeClass('hidden');
        getTasks();
    }).fail(function (error) {
        console.log('Error deleting', error);
    })
}

// Gets all completed tasks to DOM
function completedBtnClick() {
    console.log('in getTasks');
    $.ajax({
        type: 'GET',
        url: '/tasks/completed'
    }).done(function (response) {
        console.log('got some tasks: ', response);
        //Append to dom function
        allTasks = response;
        appendToDom(response);
        var totalCompleted = response.length;
        console.log('total, not complete');
        console.log(totalCompleted, totalCompleted);
        $('#total-results').text('Total Tasks Completed: ' + totalCompleted + '/' + totalCompleted);
        $('#clearComplete').removeClass('hidden');
    }).fail(function (error) {
        console.log('GET failed:', error);
    })
}

// Gets all actives tasks to DOM
function activeBtnClick() {
    console.log('in getTasks');
    $.ajax({
        type: 'GET',
        url: '/tasks/active'
    }).done(function (response) {
        console.log('got some tasks: ', response);
        //Append to dom function
        allTasks = response;
        appendToDom(response);
        // get total 
        var totalActive = response.length;
        // get the not complete
        var notComplete = response.filter(function (tasks) {
            return tasks.status !== 'Complete';
        }).length;
        console.log('total, not complete');
        console.log(totalActive, notComplete);
        $('#total-results').text('Total Tasks Active: ' + notComplete + '/' + totalActive);
        $('#clearComplete').addClass('hidden');
    }).fail(function (error) {
        console.log('GET failed:', error);
    })
}


// function to close form from cancel button clicked
function closeForm() {
    $('.collapse').collapse('hide')
    $('#addTaskBtn').css("visibility", "visible");
}

// function to show form when add task button is clicked
function showForm() {
    $(this).css("visibility", "hidden");
}


function onStatusChange(event) {
    var $task = $(this).closest('tr').data('task')
    console.log('status change');

    $task.status = $(this).val();

    console.log($task);
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + $task.id,
        data: $task
    }).done(function (response) {
        console.log('send edits function response:', response)
        getTasks();
    }).fail(function (error) {
        console.log('error getting update tasks back:', error)
    })
}

var editing = false;
var editingId;

function addButtonClick() {
    console.log('in addButton on click');
    var task = $('#taskIn').val();
    var priority = $('#priorityIn').val();
    var startDate = $('#startDateIn').data('DateTimePicker').date().format('MM/DD/YYYY');
    var dueDate = $('#dueDateIn').data('DateTimePicker').date().format('MM/DD/YYYY');
    var status = 'Not Started'
    // get user input form validation

    var formComplete = true;
    if (task === '') {
        formComplete = false;
    }
    if (priority === '') {
        formComplete = false;
    }
    if (startDate === '' || !moment(startDate, 'MM/DD/YYYY', true).isValid()) {
        formComplete = false;
    }
    if (dueDate === '' || !moment(dueDate, 'MM/DD/YYYY', true).isValid()) {
        formComplete = false;
    }
    if (status === '') {
        formComplete = false;
    }

    if (formComplete) {
        var objectToSend = {
            tasks: task,
            priority: priority,
            startdate: startDate,
            duedate: dueDate,
            status: status
        }
        if (editing === true) {
            editing = false;
            saveTask();
        } else {
            // call sendTask with the new obejct
            sendTask(objectToSend);
        }
        $('#addtask .form-control').val('');
    } else {
        alert("Please complete the form");
    }
}

// GET AJAX call to server to get tasks
function getTasks() {
    console.log('in getTasks');
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).done(function (response) {
        console.log('got some tasks: ', response);
        //Append to dom function
        allTasks = response;
        if (response.length > 0) {
            $('.alert-info').addClass('hidden');
            $('table').removeClass('hidden');
            appendToDom(response);
            // get total 
            var total = response.length;
            // get the not complete
            var notComplete = response.filter(function (tasks) {
                return tasks.status !== 'Complete';
            }).length;
            console.log('total, not complete');
            console.log(total, notComplete);
            $('#total-results').text('Total Tasks: ' + notComplete + '/' + total);
        } else {
            $('.alert-info').removeClass('hidden');
            $('table').addClass('hidden');
        }
    }).fail(function (error) {
        console.log('GET failed:', error);
    })
}

// POST AJAX call to server to add new tasks called in addButtonClick
function sendTask(newTask) {
    console.log('in saveTask', newTask);
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).done(function (response) {
        console.log('added', response);
        newTask.id = response;
        getTasks();
        $("#addTaskBtn").css("visibility", "visible");
        $('.collapse').collapse('hide');
    }).fail(function (error) {
        console.log('Failed:', error);
    })
}

var toDeleteId;

//DELETE AJAX call to remove a task
function confirmDeleteTask() {
    $('#delete-modal').modal();
    toDeleteId = $(this).closest('tr').data('id');
    console.log(toDeleteId);
}

function deleteTask() {
    $('#delete-modal').modal('hide');
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + toDeleteId
    }).done(function (response) {
        // remove the selected row instead of getting all the tasks from the server and rendering it again
        $('tr[data-id=' + toDeleteId + ']').fadeOut(500, function () {
            $(this).remove();
            // check to see if there still any tasks left
            // if not then hide the table and show the alert again
            if ($('#viewTasks').find('tr').length === 0) {
                // there no more tasks
                $('.alert-info').removeClass('hidden');
                $('table').addClass('hidden');
            }
        });
    }).fail(function (error) {
        console.log('Error deleting', error);
    })
}

// appends to DOM
function appendToDom(tasks) {
    $('#viewTasks').empty();
    for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i]);
        tasks[i].startdate = moment(tasks[i].startdate).format('MM/DD/YYYY');
        tasks[i].duedate = moment(tasks[i].duedate).format('MM/DD/YYYY');
        var bgClass = '';
        var currentDate = new Date();
        console.log('a', tasks[i].status)
        // adds dropdown for status in row with bootstrap
        var status = `<select class="form-control">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>`;
        // adds pencil icon and tooltip to edit button
        var editButton = `<button class="btn btn-info editTasks" data-toggle="tooltip" data-placement="top" title="Edit"><span class="glyphicon glyphicon-pencil"></span></button>`;
        // adds trash icon and tool tip to delete button
        var deleteButton = `<button class="btn btn-danger delete" data-toggle="tooltip modal" data-placement="top" title="Delete" data-target=".bs-example-modal-sm"><span class="glyphicon glyphicon-trash"></span></button>`
        // adds green backgroud to Completed tasks and red to past due date tasks
        if (tasks[i].status === 'Complete') {
            bgClass = 'bg-success';
        } else if (moment(tasks[i].duedate, 'MM/DD/YYYY').isBefore(moment())) {
            bgClass = 'bg-danger';
        }
        var $tr = $tr = $('<tr style="display:none" data-index="' + i + '" data-id="' + tasks[i].id + '" class=" ' + bgClass + '"><td>' + tasks[i].tasks + '</td><td>' + tasks[i].priority + '</td><<td>' + tasks[i].startdate + '</td><td>' + tasks[i].duedate + '</td><td>' + status + '</td><td class="text-center">' + editButton + deleteButton + '</td></tr>');
        $tr.data('task', tasks[i]);
        $('#viewTasks').append($tr);
        // after we append the data, go and change the select button value to the selected status
        $tr.find('select').val(tasks[i].status);
        $tr.fadeIn('slow');
    }
    //to get tooltip to show up
    $('[data-toggle="tooltip"]').tooltip();
}

// shows form when edit button is clicked on task tow
var editingTask;
function editTasksFunction() {
    editingTask = $(this).closest('tr').data('task');

    var task = editingTask.tasks;
    var priority = editingTask.priority;
    var startDate = editingTask.startdate;
    var dueDate = editingTask.duedate;
    var status = editingTask.status;
    editingId = editingTask.id;
    editing = true;
    $('#addButton').text('Edit Done').addClass("btn-success");
    $('#taskIn').val(task);
    $('#priorityIn').val(priority);
    $('#startDateIn').data('DateTimePicker').date(startDate);
    $('#dueDateIn').data('DateTimePicker').date(dueDate);
    $('#addTaskBtn').css("visibility", "hidden");
    $('.collapse').collapse('show');
};

// Updates the edits of tasks called inside addButtonClick function
function saveTask() {
    var task = $('#taskIn').val();
    var priority = $('#priorityIn').val();
    var startDate = $('#startDateIn').data('DateTimePicker').date().format('MM/DD/YYYY');
    var dueDate = $('#dueDateIn').data('DateTimePicker').date().format('MM/DD/YYYY');
    var updateTask = {
        tasks: task,
        priority: priority,
        startdate: startDate,
        duedate: dueDate,
        status: editingTask.status
    }
    console.log('saveTask and the editingID is:', editingId);
    console.log('This is the updateTask:', updateTask);
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + editingId,
        data: updateTask
    }).done(function (response) {
        console.log('send edits function response:', response)
        $('#addButton').text('Add Task').removeClass("btn-success");
        $('#addTaskBtn').css("visibility", "visible");
        $('.collapse').collapse('hide');
        getTasks();
    }).fail(function (error) {
        console.log('error getting update tasks back:', error)
    })
}
