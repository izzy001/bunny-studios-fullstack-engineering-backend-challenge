const mongoose = require('mongoose');
const request = require('supertest');
const { Task } = require('../../models/task');
const { User } = require('../../models/user');


describe('/api/tasks', () => {
    let server;
    let user_id;
    let user;
    let task;


    beforeEach(async () => {
        server = require('../../index');
        user_id = mongoose.Types.ObjectId().toHexString();

        user = new User({
            _id: user_id,
            name: 'anna'
        });

        await user.save();
    });
    afterEach(async () => {
        await server.close();
        await Task.deleteMany({});
        await User.deleteMany({});
    });

    describe('GET /:id', () => {
        const exec = () => {
            return request(server)
                .post('/api/tasks')
                .send(user_id);
        };

        it('should return 400 if user_id is invalid', async () => {
            user_id = '1';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if user with the given user_id was not found', async () => {
            user_id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return all tasks for a given user', async () => {
            user_id = mongoose.Types.ObjectId();
            await Task.collection.insertOne(
                {
                    user: {
                        _id: user_id,
                        name: 'anna'
                    },
                    tasks: {
                        description: 'stay hydrated'
                    }
                }

            );
            const res = await request(server)
                .get('/api/tasks/' + user_id);
            expect(res.status).toBe(200);
            expect(res.body.data.tasks.length).toBe(1)
            expect(res.body.data.tasks[0]).toHaveProperty('_id');
            expect(res.body.data.tasks[0]).toHaveProperty('state');
            expect(res.body.data.tasks[0]).toHaveProperty('description');
            expect(res.body.data.tasks.some(t => t.state === 'To-Do')).toBeTruthy();
        });
    });

    describe('POST /', () => {
        user = {
            _id: mongoose.Types.ObjectId(),
            name: 'anna'
        }
        description = 'stay hydrated';

        user_id = user._id.toHexString();

        const exec = async () => {
            return await request(server)
                .post('/api/tasks')
                .send({ user_id, description });
        };

        //should return 404 if id id invalid
        it('should return 400 if id is invalid', async () => {
            user_id = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        //should return 404 if user is not found

        it('should return 400 if user is invalid', async () => {
            user_id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        //should return 200 if task is created successfully

        it('should return 200 if task is created successfully', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('tasks')
            expect(res.body.tasks.some(task => task.state === 'To-Do')).toBeTruthy();
            expect(res.body.tasks.some(task => task.description === 'stay hydrated')).toBeTruthy();
            expect(res.body.user.name === 'anna').toBeTruthy();
        });
    });

    describe('POST /add-to-tasks-list/:id', () => {
        let newTask;
        let id;

        const exec = async () => {
            return await request(server)
                .post('/api/tasks/add-to-tasks-list/' + id)
                .send({ tasks: newTask });
        };

        beforeEach(async () => {
            task = new Task({
                user: {
                    _id: mongoose.Types.ObjectId(),
                    name: 'anna',
                },
                tasks: {
                    description: 'stay hydrated'
                }
            });
            await task.save();
            id = task._id;
            newTask = {
                description: 'play golf tomorrow by 6PM'
            };
        });

        it('should return 400 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(400);
        });


        it('should return 404 if task with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should update the task list if input is valid', async () => {
            await exec();
            const updatedTask = await Task.findById(id);
            expect(updatedTask.tasks.some(t => t.description === 'play golf tomorrow by 6PM')).toBeTruthy();
        });

        it('should return 200 and updated task list if new task is added successfully', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body.details.tasks.length > 1).toBeTruthy();
            expect(res.body.details.user.name === 'anna').toBeTruthy();
            expect(res.body.details.tasks.some(task => task.description === 'play golf tomorrow by 6PM')).toBeTruthy();
        });


    });

    describe('PUT /:id', () => {
        let newState;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/tasks/' + id)
                .send({ state: newState });
        }

        beforeEach(async () => {
            task = new Task({
                user: {
                    _id: mongoose.Types.ObjectId(),
                    name: 'anna',
                },
                tasks: {
                    description: 'stay hydrated'
                }
            });
            await task.save();
            // for(const task of task.tasks){
            //     id = task._id;
            // }
            newState = 'done';
        });

        it('should return 400 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if single task with the given id was not found', async () => {
            for (const item of task.tasks) {
                // id = item._id;
                item._id = mongoose.Types.ObjectId();
                id = item._id;
            }
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 200 and updated single task state if new task is added successfully', async () => {
            for (const item of task.tasks) {
                id = item._id;
            }
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body.details.tasks.some(task => task.state === 'done')).toBeTruthy();
        });


    });

});