const express = require('express');
const connection = require('./config');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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