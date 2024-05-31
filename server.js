const express = require('express');
const app = express();
const pg = require('pg');

const client = new pg.Client('postgres://localhost/acme_hr_directory');
client.connect();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//GET /api/employees
app.get('/api/employees', async(req,res,next)=>{
    try {
        const result = await client.query('SELECT * FROM employees');
        res.json(result.rows);
        } catch (err) {
            next(err)
            }
})
//GET /api/departments
app.get('/api/departments', async(req,res,next)=>{
    try {
        const result = await client.query('SELECT * FROM departments');
        res.send(result.rows);
    } catch(err){
        next(err)
    }
})

//POST /api/employees
app.post('/api/employees', async(req,res,next)=>{
    try {
        const {name, department_id} = req.body;
        const result = await client.query('INSERT INTO employees (name, created_at, updated_at , department_id) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $2) RETURNING *',[name, department_id]);
        res.status(201).json(result.rows[0]);
    }catch(err) {
        next(err)
    }
})

//DELETE /api/employees/:id 
app.delete('/api/employees/:id', async(req,res,next)=>{
    try {
        const id = req.params.id;
        const result = await client.query('DELETE FROM employees WHERE id = $1',[id]);
        res.status(204).send();
        }catch(err) {
            next(err)
            }
            })

//PUT /api/employees/:id 
app.put('/api/employees/:id', async(req,res,next)=>{
    try {
        const id = req.params.id;
        const {name, department_id} = req.body;
        const result = await client.query('UPDATE employees SET name = $1, updated_at = CURRENT_TIMESTAMP, department_id = $2 WHERE id = $3 RETURNING *',[name, department_id, id]);
            res.json(result.rows[0]);
            }catch(err) {
                next(err)
                }
                })
            

app.listen(3000, () => {
    console.log("app runs");
});