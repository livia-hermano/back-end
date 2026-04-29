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

const validarExistencia = (resultado, res, tipo) =>{
    if(resultado.length == 0){
            res.status(404).json({
                sucesso: false,
                mensagem: `${tipo} não encontrado`
    })
            return false
          }
        return true
    }
        
app.get('/usuarios/:id', async (req, res) => {
    try{
        const {id} = req.params
        const usuarios =await queryAsync('SELECT * FROM usuarios WHERE id =?', [id])

        if(!validarExistencia (usuario, res, "usuário")){
            return
        }
        res.status(200).json({
            sucesso: true,
            dados: usuario[0]
        })
        
    
    }catch (erro){
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar usuários',
        })
    }
})

//Exercício 2

const validarDados = ({cliente, valor})=>{
    if(!cliente || !valor){
        return "Cliente e valor são obrigatórios"
    }
    if(typeof valor!== 'number' || valor<=0){
        return "valor inválido"
        }
    return null
    }


app.post('/pedidos', async (req, res) => {
    try{
        const erro = validarDados(req.body)

        if(erro){
            return res.status(400).json({
                sucesso: false,
                mensagem: erro
            })
        }

         await queryAsync("INSERT INTO pedido SET ?", [req.body])
         res.status(201).json({
            sucesso: true,
            mensagem: "Pedido criado",
    })
}catch(erro){
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar pedido'
    })
}
})

//Exercício 3

app.put('/salas/:id', async (req, res) => {
    try{
        const {id} = req.params
        const dados = req.body
        const sala = await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])

        if(!validarExistencia[sala, res, "sala"]){
            return
        }

        if(Object.keys(dados).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum dado enviado'
            })
        }

        await queryAsync("UPDATE sala SET ? WHERE id = ?", [dados, id])
        res.status(200).json({
            sucesso: true,
            mensagem: 'Sala foi atualizada'
        })
    }catch(erro){
          res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar sala',
        })
    }
})

app.delete('/salas/:id', async (req, res) => {
    try{
        const {id} = req.params

         if(!validarExistencia[sala, res, "sala"]){
            return
        }

        const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])
        
        await queryAsync("DELETE FROM sala WHERE id = ?", [id])
        res.json({
             sucesso: true,
             mensagem: 'Sala foi excluída com sucesso'
            })
        }catch(erro){
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao deletar a sala',
            })
        }
    })