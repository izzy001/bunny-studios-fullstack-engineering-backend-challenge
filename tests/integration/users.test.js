const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
let server;

describe('/api/users', () => {
    beforeEach(() => {
        server = require('../../index');
    });

    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                { name: 'anna' },
                { name: 'dave' }
            ]);
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
            expect(res.body.details.length).toBe(2);
            expect(res.body.details.some(g => g.name === 'anna')).toBeTruthy();
            expect(res.body.details.some(g => g.name === 'dave')).toBeTruthy();
        })
    });

    describe('POST /', () => {
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/users')
                .send({ name });
        };

        beforeEach(() => {
            name = 'anna';
        });

        it('should return 400, if user is less than 2 characters', async () => {
            name = 'a';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 400, if user is more than 50 characters', async () => {

            //generate a long string.
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);

        });

        it('should save the user if data is valid', async () => {
            await exec();
            const user = User.find({ name: 'anna' });

            expect(user).not.toBeNull();
        });

        it('should return the user if data is valid', async () => {

            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body.details).toHaveProperty('name', 'anna');
        });

    });

    describe('PUT /:id', () => {
        let newName;
        let user;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/users/' + id)
                .send({ name: newName });
        };

        beforeEach(async () => {
            user = new User({ name: 'anna' });
            await user.save();

            id = user._id;
            newName = 'updatedname';
        });

        it('should return 400 if user is less than 2 characters', async () => {
            newName = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if user is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if id is invalid', async () => {
            id = 1;

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if user with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the user if input is valid', async () => {
            await exec();

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.name).toBe(newName);
        });

        it('should return the updated user if input is valid', async () => {
            const res = await exec();

            expect(res.body.details).toHaveProperty('_id');
            expect(res.body.details).toHaveProperty('name', newName);
        })
    });

    describe('DELETE /:id', () => {
        let user;
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/api/users/' + id)
                .send();
        };

        beforeEach(async () => {
            // Before each test we need to create a genre and 
            // put it in the database.      
            user = new User({ name: 'anna' });
            await user.save();

            id = user._id;
        });

        it('should return 400 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if no user with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the user if input is valid', async () => {
            await exec();

            const userInDb = await User.findById(id);

            expect(userInDb).toBeNull();
        });

        it('should return the removed user', async () => {
            const res = await exec();

            expect(res.body.details).toHaveProperty('_id', user._id.toHexString());
            expect(res.body.details).toHaveProperty('name', user.name);
        });
    });

});