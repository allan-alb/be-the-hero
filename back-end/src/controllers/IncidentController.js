const connection = require('../database/connection');

module.exports = {
    async index(request,response){
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count(); //[count] para poder acessar o res. sem usar count(0)
        
        const incidents = await connection('incidents')
            .limit(5)
            .offset((page-1)*5)
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.phone',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id }); //com as chaves o front-end receberá também a info do nome da chave (id)
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .select('ong_id')
            .where('id', id)
            .first();

        if (!incident){
            return response.status(404).send();
        }

        if (incident.ong_id !== ong_id){
            return response.status(401).json({ error: "Operation not permitted." });
        }

        await connection('incidents').delete().where('id', id);
        return response.status(204).send();
    }
}