console.log('js sourced');

var allTasks;

$(document).ready(readyNow);

function readyNow() {

    console.log('JQ');
    // load existing Tasks on page load
    getTasks();
    // add tasks button click
    $('#addButton').on('click', addButtonClick);
    $('#viewTasks').on('click', '.delete', confirmDeleteTask);
    $('#delete-modal').on('click', '.delete', deleteTask);
    $('#viewTasks').on('click', '.editTasks', editTasksFunction)
    $('#viewTasks').on('change', 'tr select', onStatusChange);
    $('#addTaskBtn').on('click', showForm)
    $('#cancelBtn').on('click', closeForm)
    $('.date-picker').datetimepicker({
        format: 'MM/DD/YYYY'
    });
}

function closeForm() {
    $('.collapse').collapse('hide')
    $('#addTaskBtn').css("visibility", "visible");
}

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

function getTasks() {
    console.log('in getTasks');
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).done(function (response) {
        console.log('got some Tasks: ', response);
        //Append to dom function
        appendToDom(response);
    }).fail(function (error) {
        console.log('GET failed:', error);
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
    // get user input and put in an object

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
        appendToDom(response);
    }).fail(function (error) {
        console.log('GET failed:', error);
    })
}

// POST AJAX call to server to add new tasks
function sendTask(newTask) {
    console.log('in saveTask', newTask);
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).done(function (response) {
        console.log('added', response);
        newTask.id = response;
        // addTaskToBody(newTask);
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
        $('tr[data-id=' + toDeleteId + ']').fadeOut(500, function(){
            $(this).remove();
        })
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
        var status = `<select class="form-control">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>`;

        var editButton = `<button class="btn btn-info editTasks" data-toggle="tooltip" data-placement="top" title="Edit"><span class="glyphicon glyphicon-pencil"></span></button>`;

        var deleteButton = `<button class="btn btn-danger delete" data-toggle="tooltip modal" data-placement="top" title="Delete" data-target=".bs-example-modal-sm"><span class="glyphicon glyphicon-trash"></span></button>`

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

    $('[data-toggle="tooltip"]').tooltip();
}

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

function addTaskToBody(task) {
    var status = `<select class="form-control">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
        </select>`;

    console.log(task);

    var $tr = $('<tr data-id="' + task.id + '"><td>' + task.tasks + '</td><td>' + task.priority + '</td><<td>' + task.startdate + '</td><td>' + task.duedate + '</td><td>' + status + '</td><td>' + '<button class="btn btn-info editTasks">Edit</button>' + '</td><td>' + '<button class="btn btn-danger delete">X</button>' + '</td></tr>');

    $tr.data('task', task);
    $('#viewTasks').prepend($tr);
}