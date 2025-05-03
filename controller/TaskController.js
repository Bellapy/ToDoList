// controller/TaskController.js
const Task = require('../models/Task');

// --- Lista todas as tarefas (para renderizar a página principal) ---
const getAllTasks = async (req, res) => {
    console.log("--- Entrou em getAllTasks ---"); // LOG GETALL 1
    try {
        console.log("Buscando todas as tarefas no DB..."); // LOG GETALL 2
        const tasksList = await Task.find();
        console.log(`Encontradas ${tasksList.length} tarefas.`); // LOG GETALL 3
        console.log("Renderizando 'index' com tasksList e task=null"); // LOG GETALL 4
        return res.render("index", { tasksList, task: null }); // Passando task: null explicitamente
    } catch (err) {
        console.error("!!! Erro em getAllTasks:", err); // LOG GETALL 5 (ERRO)
        res.status(500).send({ error: err.message });
    }
};

// --- Cria uma nova tarefa ---
const createTask = async (req, res) => {
    console.log("--- Entrou em createTask ---"); // LOG CREATE 1
    const taskData = req.body; // Renomeado para clareza
    console.log("Recebido no body para criar:", taskData); // LOG CREATE 2

    // Validação básica do input
    if (!taskData || !taskData.task || taskData.task.trim() === "") { // Adicionado trim() para evitar tarefas vazias
        console.log("Body inválido ou campo 'task' faltando/vazio."); // LOG CREATE 3
        // Considerar enviar uma mensagem de erro em vez de só redirecionar
        // return res.status(400).send("O campo 'task' é obrigatório."); // Alternativa
        return res.redirect("/"); // Mantendo comportamento original por enquanto
    }

    try {
        console.log("Tentando criar tarefa no DB com dados:", taskData); // LOG CREATE 4
        // Criando objeto para garantir que apenas campos do schema sejam usados
        const newTask = {
            task: taskData.task,
            // O campo 'check' não está vindo do formulário, então não incluímos ou definimos um default.
            // O schema define 'check' como obrigatório, isso pode causar erro se não tratado.
            // VAMOS ADICIONAR UM VALOR PADRÃO AQUI TEMPORARIAMENTE:
            check: false // <<-- ADICIONADO VALOR PADRÃO PARA 'check'
        };
        const createdTask = await Task.create(newTask);
        console.log("Tarefa criada com sucesso no DB:", createdTask); // LOG CREATE 5

        console.log("Redirecionando para / ..."); // LOG CREATE 6
        return res.redirect('/');

    } catch (err) {
        console.error("!!! Erro ao criar tarefa:", err); // LOG CREATE 7 (ERRO)
        // Verificar se é erro de validação do Mongoose
        if (err.name === 'ValidationError') {
             // Poderia extrair mensagens de erro específicas aqui
             console.error("Erro de validação do Mongoose:", err.errors);
             // Poderia redirecionar com mensagem de erro ou renderizar página com erro
             return res.status(400).send({ message: "Erro de validação", errors: err.errors });
        }
        // Outros erros
        res.status(500).send({ error: err.message });
    }
};

// --- Busca uma tarefa pelo ID (para edição/visualização) ---
const getById = async (req, res) => {
    console.log(`--- Entrou em getById para ID: ${req.params.id} ---`); // LOG GETBYID 1
    try {
        const taskId = req.params.id;
        console.log(`Buscando tarefa com ID: ${taskId}`); // LOG GETBYID 2
        const task = await Task.findOne({ _id: taskId });

        if (!task) {
            console.log(`Tarefa com ID ${taskId} não encontrada.`); // LOG GETBYID 3 (NÃO ENCONTRADO)
            // Idealmente, redirecionar para uma página de erro 404 ou a inicial com mensagem
            // return res.status(404).send("Tarefa não encontrada"); // Alternativa
            return res.redirect("/"); // Comportamento atual pode ser confuso
        }
        console.log("Tarefa encontrada:", task); // LOG GETBYID 4 (ENCONTRADO)

        console.log("Buscando todas as tarefas para a lista..."); // LOG GETBYID 5
        const tasksList = await Task.find();
        console.log(`Encontradas ${tasksList.length} tarefas na lista.`); // LOG GETBYID 6
        console.log("Renderizando 'index' com a tarefa encontrada e a lista."); // LOG GETBYID 7
        res.render("index", { task, tasksList });

    } catch (err) {
        console.error(`!!! Erro em getById (ID: ${req.params.id}):`, err); // LOG GETBYID 8 (ERRO)
         // Verificar se é erro de Cast (ID inválido)
        if (err.name === 'CastError') {
            console.error("Erro de Cast: ID inválido.");
            return res.status(400).send("ID da tarefa inválido.");
        }
        res.status(500).send({ error: err.message });
    }
};

// --- Atualiza uma tarefa existente ---
const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const updatedData = req.body;
    console.log(`--- Entrou em updateTask para ID: ${taskId} ---`); // LOG UPDATE 1
    console.log("Dados recebidos para atualizar:", updatedData); // LOG UPDATE 2

    // Validação básica do input
    if (!updatedData || !updatedData.task || updatedData.task.trim() === "") {
        console.log("Body inválido ou campo 'task' faltando/vazio para atualização."); // LOG UPDATE 3
        // return res.status(400).send("O campo 'task' é obrigatório para atualizar."); // Alternativa
        return res.redirect("/"); // Comportamento atual
    }

    try {
        console.log(`Tentando atualizar tarefa com ID: ${taskId}`); // LOG UPDATE 4
        // Usar findByIdAndUpdate para mais eficiência e opções (como retornar o doc atualizado)
        const result = await Task.updateOne(
            { _id: taskId },
            { task: updatedData.task }
             // Você pode adicionar { runValidators: true } se tiver validadores no schema
        );

        console.log("Resultado da operação updateOne:", result); // LOG UPDATE 5

        if (result.matchedCount === 0) {
             console.log(`Tarefa com ID ${taskId} não encontrada para atualização.`); // LOG UPDATE 6 (NÃO ENCONTRADO)
             return res.status(404).send("Tarefa não encontrada para atualização."); // Melhor retornar 404
        }
        if (result.modifiedCount === 0 && result.matchedCount === 1) {
             console.log(`Tarefa ${taskId} encontrada, mas nenhum dado foi modificado.`); // LOG UPDATE 7 (NÃO MODIFICADO)
        } else {
             console.log(`Tarefa ${taskId} atualizada com sucesso.`); // LOG UPDATE 8 (SUCESSO)
        }

        console.log("Redirecionando para / ..."); // LOG UPDATE 9
        return res.redirect('/');

    } catch (err) {
        console.error(`!!! Erro em updateTask (ID: ${taskId}):`, err); // LOG UPDATE 10 (ERRO)
        if (err.name === 'CastError') {
            console.error("Erro de Cast: ID inválido.");
            return res.status(400).send("ID da tarefa inválido.");
        }
         if (err.name === 'ValidationError') {
             console.error("Erro de validação do Mongoose:", err.errors);
             return res.status(400).send({ message: "Erro de validação", errors: err.errors });
        }
        res.status(500).send({ error: err.message });
    }
};


// --- Exclui uma tarefa ---
const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    console.log(`--- Entrou em deleteTask para ID: ${taskId} ---`); // LOG DELETE 1

    try {
        console.log(`Tentando excluir tarefa com ID: ${taskId}`); // LOG DELETE 2
        const result = await Task.deleteOne({ _id: taskId });
        console.log("Resultado da operação deleteOne:", result); // LOG DELETE 3

        // Verifica se a tarefa foi encontrada e excluída
        if (result.deletedCount === 0) {
            console.log(`Tarefa com ID ${taskId} não encontrada para exclusão.`); // LOG DELETE 4 (NÃO ENCONTRADO)
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        console.log(`Tarefa ${taskId} excluída com sucesso.`); // LOG DELETE 5 (SUCESSO)
        // Envia uma resposta JSON indicando sucesso (como já estava)
        return res.status(200).json({ message: 'Tarefa excluída com sucesso.' });

    } catch (err) {
        console.error(`!!! Erro em deleteTask (ID: ${taskId}):`, err); // LOG DELETE 6 (ERRO)
         if (err.name === 'CastError') {
            console.error("Erro de Cast: ID inválido.");
            // Retornar JSON consistente com o sucesso/falha da API
            return res.status(400).json({ message: 'ID da tarefa inválido.' });
        }
        res.status(500).json({ error: err.message }); // Retornar JSON aqui também
    }
};


// --- Exporta todas as funções ---
module.exports = {
    getAllTasks,
    createTask,
    getById,
    updateTask,
    deleteTask
};