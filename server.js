const express = require('express');
const connection = require('./config');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User API's
app.post('/api/users', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'You must provide a username' });
    }
    try {
        const createUserQuery = 'INSERT INTO users(username) VALUES(?);';
        const getUserByIdQuery = 'SELECT * FROM users WHERE id = ?;';

        const [result] = await connection.query(createUserQuery, [username]);
        const [userResult] = await connection.query(getUserByIdQuery, [result.insertId]);
        res.json(userResult[0])
    } catch (error) {
        res.status(400).json(error);
    }
})

app.get('/api/todos', async (req, res) => {
    try {
        const getAllTodosQuery = 'SELECT * FROM todos;';
        const [todos] = await connection.query(getAllTodosQuery);
        res.json(todos);
    } catch (error) {
        res.status(400).json(error);
    }
})

app.post('/api/todos', async (req, res) => {
    const { task } = req.body;

    if(!task) {
        return res.status(400).json({error: 'You must provide a task!'})
    }
    // If there is a task, save it to the database
    // JS will "try" to run every single line of code inside of the "try" block
    // If any lines of the code throws an error, JS will take that error and
    // put that error in the "catch" block, and then run the code in the "catch" block.
    // the code in the "catch" block will only run if there is no error in the "try" block.
    try {
        const insertQuery = 'INSERT INTO todos(task) VALUES(?);';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
        const [result] = await connection.query(insertQuery, [task]);
        const [todosResult] = await connection.query(getTodoById, [result.insertId]);

        res.json(todosResult[0]);
    } catch (error) {
        res.status(400).json(error);
    }

});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));