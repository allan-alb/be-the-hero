const request = require('supertest');
const connection = require('../../src/database/connection');
const app = require('../../src/app');

describe('Incident', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async() => {
        await connection.destroy();
    });

    it('should be able to create a new incident', async() => {
        const response = await request(app).post('/incidents')
            .send({
                title: "Animal acidentado",
                description: "Houve um acidente com o animal e ele necessita de cuidados médicos",
                value: "200",
            })
            .set('authorization', 'a88b99c0');

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(1);        
    });

    it('should throw an error if ong id is invalid on deleting', async() => {
        const response = await request(app).delete('/incidents/1')
            .send()
            .set('authorization', 'b98b99c1');

        expect(response.status).toBe(401);
    });

    it('should be able to delete an incident', async() => {
        const response = await request(app).delete('/incidents/1')
            .send()
            .set('authorization', 'a88b99c0');

        expect(response.status).toBe(204);
    });
    
    it('should throw an error if incident id is invalid on deleting', async() => {
        const response = await request(app).delete('/incidents/3')
            .send()
            .set('authorization', 'a88b99c0');
        expect(response.status).toBe(404);
    }); 
    
});