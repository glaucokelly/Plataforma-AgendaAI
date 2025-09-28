import Profissional from '../models/profissional.js';

//Criar novo profissional
const criarProfissional = async (req, res) => {
    try{
        const { nome, especialidade, crm, contato, diasAtendimento } = req.body;
    
        const profissionalExistente = await Profissional.findOne({ crm});
        if (profissionalExistente) {
            return res.status(400).json({ mensagem: 'Profissional já cadastrado com esse CRM.' });
        }

        const novoProfissional = new Profissional({
            nome,
            especialidade,
            crm,
            contato,
            diasAtendimento
        });

        const profissionalSalvo = await novoProfissional.save();
        return res.status(201).json({ mensagem: 'Profissional criado com sucesso.', profissional: profissionalSalvo });

    } catch (error) {
        concole.error('Erro ao criar Profissional:', error);
        return res.status(500).json({ mensagem: 'Erro ao criar Profissional.' });
    }
};

//Deletar profissional
const deletarProfissional = async (req, res) => {
    try {
        const profissional = await Profissional.findByIdAndDelete(req.params.id);

        if (!profissional) {
            return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
        }

        res.json({ mensagem: 'Profissional deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar profissional:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ mensagem: 'IProfissional não encontrado!' });
        }
        res.status(500).json({ mensagem: 'Erro ao deletar profissional.' });
    }
};

//Atualizar profissional
const atualizarProfissional = async (req, res) => {
    try {
        const { nome, especialidade, crm, contato, diasAtendimento } = req.body;

        if (crm) {
            const profissionalExistente = await Profissional.findOne({ crm, _id: { $ne: req.params.id} });

            if(profissionalExistente){
                return res.status(400).json({ mensagem: 'Outro profissional já cadastrado com esse CRM.' });
            }
        }

        const profissionalAtualizado = await Profissional.findByIdAndUpdate(
            req.params.id,
            { nome, especialidade, crm, contato, diasAtendimento },
            { new: true, runValidators: true }
        );

        if (!profissionalAtualizado) {
            return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar profissional:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ mensagem: 'Profissional não encontrado!' });
        }
        res.status(500).json({ mensagem: 'Erro ao atualizar profissional.' });
    }
};

//listar todos os profissionais
const listarProfissionais = async (req, res) => {
    try{
        const profissionais = await Profissional.find().sort({ nome: 1});
        res.json(profissionais);
    } catch (error) {
        console.error('Erro ao listar profissionais:', error);
        res.status(500).json({ mensagem: 'Erro ao listar profissionais.' });
    }
};

//buscaar profissinoal
const buscarProfissional = async (req, res) => {
    try {
        const profissional = await Profissional.findById(req.params.id);

        if (!profissional) {
            return res.status(404).json({ mensagem: 'Profissional não encontrado.'});
        }

        res.json(profissional);
    } catch (error) {
        console.error('Erro ao buscar profissional:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ mensagem: 'Profissional não encontrado!' });
        }
        res.status(500).json({ mensagem: 'Erro ao buscar profissional.' });
    }   
};

//Exportar as funções
export {
    criarProfissional,
    deletarProfissional,
    atualizarProfissional,
    listarProfissionais,    
    buscarProfissional
};
