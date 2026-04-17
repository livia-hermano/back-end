// Lívia Hermano
//Exercício 1

app.get('/usuarios', async (req, res) => {
    try{
    const Buscarusuarios = await queryAsync("SELECT * FROM usuarios")
    res.json({
        sucesso: true,
        dados: usuarios,
        total: usuarios.length
    })
    }catch(erro){
    console.error('Erro ao listar produtos:', erro)
    res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar produtos",
        erro: erro.message
    })

}})

app.get('/usuarios/:id', async (req, res) => {
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de usuário inválido'
            })
        }
        const BuscarId = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [id])
          if (BuscarId.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            })
        } else {
            res.json({sucesso: true, dados: usuarios [0]})
    }
}catch (erro){
    console.error('Erro ao listar usuários:', erro)
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar usuários',
        erro: erro.message
    })
}
})

//Exercício 2

app.post('/pedidos', async (req, res) => {
    try{
    const { cliente, valor } = req.body

    if (!cliente || !valor) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Cliente e valor são itens obrigatórios"
        })
    }
    if(typeof valor!== 'number' || valor<=0){
        return res.status(400).json({
            sucesso: false,
            mensagem: "Valor tem que ser positivo"
        })
    }
    const novoPedido = {
        cliente: cliente.trim(),
        valor: valor
    }
    const resultado = await queryAsync('INSERT INTO pedido SET ?')
    await queryAsync("INSERT INTO pedido SET ?", [novoPedido])

    res.status(201).json({
        sucesso: true,
        mensagem: "Pedido criado",
        id: resultado.insertID
    })
}catch(erro){
    console.error('Erro ao criar pedido:', erro)
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar pedido',
        erro: erro.message
    })
}
})

//Exercício 3

app.put('/salas/:id', async (req, res) => {
    try{
        const {id} = req.params
        const {nome, capacidade} = req.body
        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }
        const salaExiste= await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])
        if(salaExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            })
        }
        const salaAtualizada = {}
        if(nome !== undefined) salaAtualizada.nome = nome.trim()
        if(valor !== undefined){
            if(typeof valor !== 'number' || valor <=0)
                return res.status(400).json({
            sucesso: false,
        mensagem: "Valor tem que ser positivo"})
        }
        if(Object.keys(salaAtualizada).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para ser atualizado'
            })
        }
        await queryAsync("UPDATE sala SET ? WHERE id = ?", [salaAtualizada, id])
        res.json({
            sucesso: true,
            mensagem: 'Sala foi atualizada'
        })
}catch(erro){
    console.error('Erro ao atualizar sala:', erro)
    res.status(500),json({
        sucesso: false,
        mensagem: 'Erro ao atualizar sala',
        erro: erro.message
    })
}
})

app.delete('/salas/:id', async (req, res) => {
    try{
        const id = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sla está inválido'
            })
        }
        const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])
        
        if (salaExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sala não foi encontrada"
            })
    }
    await queryAsync("DELETE FROM sala WHERE id = ?", [id])
    res.json({
        sucesso: true,
        mensagem: 'Sala foi excluída com sucesso'
    })
}catch(erro){
    console.error('Erro ao deletar a sala:', erro)
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao deletar a sala',
        erro: erro.message
    })
}
})