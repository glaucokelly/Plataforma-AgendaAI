import Paciente from '../models/paciente.js';

//Criar um novo paciente
const criarPaciente = async (req, res) => {
    try{
        const { nome, cpf, dataNascimento, contato, endereco, historico} = req.body;

        const pacienteExistente = await Paciente.findOne({ cpf });
        if(pacienteExistente){
            return res.status(400).json({ mensagem: 'Paciente já cadastrado' });
        }

        const novoPaciente = new Paciente({
            nome,
            cpf,
            dataNascimento,
            contato,
            endereco,
            historico
        });

        const pacienteSalvo = await novoPaciente.save();
        res.status(201).json(pacienteSalvo);
    } catch (error) {
        console.error('Erro ao criar o paciente:', error);
        res.status(500).json({ 
            mensagem: 'Erro ao criar o paciente',
            erro: error.mensagem
        });
    }

};

//Deletar um paciente
const deletarPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndDelete(req.params.id);

        if(!paciente){
            return res.status(404).json({ mensaagem: 'Paciente não encontrado'});
        }

        res.json({ mensagem: 'Paciente deletado com sucesso'});

    }catch (error){
        console.error('Erro ao deletar o paciente:', error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({ mensagem: 'Paciente não encontrado'});
        }
        res.status(500).json({ mensagem: 'Erro ao deletar o paciente'});
    }

};

//Atualizar um paciente
const atualizarPaciente = async (req, res) => {
    try{
        const { nome, cpf, dataNascimento, contato, endereco, historico } = req.body;

        if ( cpf ) {
            const pacienteExistente = await Paciente.findOne({ cpf, _id: { $ne: req.params.id} });
            if (pacienteExistente){
                return res.status(400).json({ mansagem: 'Este CPF já está cadastrado para outro paciente'});
            }
        }

        const pacienteAtualizado = await Paciente.findOneAndUpdate(
            req.params.id,
            { nome, cpf, dataNascimento, contato, endereco, historico},
            { new: true, runValidators: true}
        );

        if(!pacienteAtualizado){
            return res.status(404).json({ mensagem: 'Paciente não encontrado'});
        }

        res.json(pacienteAtualizado);

    } catch (error){
        console.error('Erro ao atualizar o paciente:', error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({ mensagem: 'Paciente não encontrado'});
        }
        res.status(500).json({ mensagem: 'Erro ao atualizar o paciente'});
    }
};

//Listar todos os pacientes
const listarPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find().sort({ nome: 1});
        res.json(pacientes);
    } catch (error) {
        console.error('Erro ao listar os pacientes:', error);
        res.status(500).json({ mensagem: 'Erro ao listar os pacientes'})
    }
};

//Buscar um paciente
const buscarPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);

        if(!paciente){
            return res.status(404).json({ mensagem: 'Paciente não encontrado'});
        }

        res.json(paciente);
    } catch (error) {
        console.error('Erro ao buscar o paciente:', error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({ mensagem: 'Paciente não encontrado'});
        }
        res.status(500).json({ mensagem: 'Erro ao buscar o paciente'});
    }
};

//Exportar as funções
export {
    criarPaciente,
    deletarPaciente,
    atualizarPaciente,
    listarPacientes,
    buscarPaciente
}