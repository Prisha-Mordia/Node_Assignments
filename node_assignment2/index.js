const express = require('express');
const PORT = 8080;

const app = express();


let tasks = [
    {
        id: 1,
        name: 'First Task',
        status: 'done',
        color: 'success'
    }
]

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// Home Page / Todo Page
app.get('/', (req, res) => {
    return res.render('todo', {tasks});
});


// Add New Task
app.get('/add', (req, res) => {
    return res.render('add');
});


app.post('/add', (req, res) => {
    let newId = tasks[tasks.length - 1].id + 1;
    data = {
        id: newId,
        name: req.body.name,
        status: req.body.taskStatus,
    }

    switch (data.status) {
        case 'todo':
            data.color = "secondary";
            break;
        case 'doing':
            data.color = "warning";
            break;
        case 'done':
            data.color = "success"
            break;
    }
    
    tasks.push(data);
    return res.redirect('/');
});


// Edit Todo Page
app.get('/edit', (req, res) => {
    let id = parseInt(req.query.id);

    if (!id) {
        return res.redirect('/');
    }

    let task = tasks.find(item => item.id == id);
    return res.render('edit', {task});
});

app.post('/edit', (req, res) => {
    let updated = tasks.map((task) => {
        if (task.id == req.query.id) {
            task.name = req.body.name
            task.status = req.body.taskStatus;

            switch (task.status) {
                case 'todo':
                    task.color = "secondary";
                    break;
                case 'doing':
                    task.color = "warning";
                    break;
                case 'done':
                    task.color = "success"
                    break;
            }
        }

        return task;
    });

    tasks = updated;
    return res.redirect('/');
});


// Delete Todo Page
app.get('/delete', (req, res) => {
    let id = parseInt(req.query.id);

    if (!id) {
        return res.redirect('/');
    }

    tasks = tasks.filter(task => task.id !== id);
    return res.redirect('/');
});


app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server is running on http://127.0.0.1:${PORT} 🚀`);
});