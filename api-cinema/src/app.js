const express = require('express')
const pool = require('./config/database')

const app = express()

app.use(express.json())

const queryAsync = (sql,values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if(err) reject(err)
            else resolve(results)
        })
    })
}

app.get('/', (req,res) => {
    res.send("API CINEMA")
})


app.get('/filmes', async (req,res) => {
    try{
        const filmes = await queryAsync ('SELECT * FROM filme')
        res.json({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        })
    } catch (erro) {
        console.error('Erro ao listar filmes: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
    }
})



app.get('/filmes/:id', async (req,res) => {
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }
        const filme = await queryAsync ('SELECT * FROM filme WHERE id = ?', [id])
            if(filme.length === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Filme não encontrado'
                })
            }
            res.json({
                sucesso: true,
                dados: filme [0]
            })
        } catch (erro) {
        console.error('Erro ao listar filmes: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
    }
    })

    app.post('/filmes', async (req,res) =>{
        try{
            const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

            if(!titulo || !genero || !duracao){
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Título, gênero ou duração são obrigatórios"
                })
            }
            if(typeof duracao !== 'number' || duracao <= 0){
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Duração deve ser um número positivo"
                })
            }
        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao: duracao,
            classificacao: classificacao || null,
            data_lancamento: data_lancamento || null
        }
        const resultado = await queryAsync('INSERT INTO filme SET ?', [novoFilme])

        res.status(201).json({
            sucesso: true,
            mensagem: "Filme criado",
            id: resultado.insertId
        })
        } catch (erro) {
            console.error('Erro ao cadastrar filmes: ', erro)
            res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar filme',
            erro: erro.message
        }
           )}
    })

    app.put('/filmes/:id', async (req,res) =>{
        try{
            const {id} = req.params
            const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

            if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }
        const filmeExiste = await  queryAsync ('SELECT * FROM filme WHERE id = ?', [id])
        if(filmeExiste.length === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Filme não encontrado'
                })
            }
        const filmeAtualizado = {}
        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao !== undefined) {
            if(typeof duracao !== 'number' || duracao <= 0)
                return res.status(400).json({
                 sucesso: false,
                 mensagem: "Duração deve ser um número positivo"            
            })
            filmeAtualizado.duracao = duracao
        }
        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao.trim()
        if(data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento.trim()

        if(Object.keys(filmeAtualizado).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nenhum campo para atualizar"
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id = ?', [filmeAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: "Filme atualizado"
        })
    } catch (erro) {
       console.error('Erro ao atualizar filme: ', erro)
            res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar filme',
            erro: erro.message
        }
           )}
})

    app.delete('/filmes/:id', async (req,res) =>{
        try{
            const {id} = req.params

            if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }
        const filmeExiste = await  queryAsync ('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.length === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Filme não encontrado'
                })
            }
            await queryAsync('DELETE FROM filme WHERE id = ?', [id])
            res.json({
                sucesso: true,
                mensagem: "Filme excluído com sucesso"
            })
        }catch (erro) {
            console.error('Erro ao deletar filme: ', erro)
            res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar filme',
            erro: erro.message
        })
    }
 }) 

// Salas:

app.get('/salas', async(req,res) => {
    try{
        const salas = await queryAsync ('SELECT * FROM sala')
        res.json({
            sucesso: true,
            dados: salas,
            total: salas.length
        })
    }catch (erro) {
        console.error('Erro ao listar as salas: ' , erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar as salas",
            erro: erro.message
        })
    }
})

app.get('/salas/:id', async (req,res) => {
    try{
        const {id} = req.params
        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Id de sala inválido'
            })
        }
        const sala = await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])
        if(sala.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }
        res.json({
            sucesso: true,
            dados: sala [0]
        })
    }catch (erro){
        console.error('Erro ao listar salas: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.message
        })
    }
})


app.post('/salas', async (req,res) =>{
    try{
        const {nome, capacidade} = req.body

        if(!nome || !capacidade){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome e capacidade são obrigatórios"
            })
        }
        if(typeof capacidade !== 'number' || capacidade <= 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Capacidade só pode ser número positivo"
            })
        }
        const novaSala = {
            nome: nome.trim(),
            capacidade: capacidade
        }
        const resultado = await queryAsync('INSERT INTO sala SET ?', [novaSala])

        res.status(201).json({
            sucesso: true,
            mensagem: "Sala criada",
            id: resultado.insertId
        })
    } catch (erro) {
        console.error('Erro ao cadastrar sala: ', erro)
            res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar sala',
            erro: erro.message
        }
           )
    }
})

app.put('/salas/:id', async (req,res) =>{
    try{
        const{id}= req.params
        const{nome, capacidade} =  req.body

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sala inválido'
            })
        }
        const salaExiste = await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])
        if (salaExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }
        const salaAtualizada = {}
        if(nome !== undefined) salaAtualizada.nome = nome.trim()
        if(typeof capacidade !== 'number' || capacidade <= 0)return res.status(400).json({
            sucesso: false,
            mensagem: "Capacidade deve ser um número positivo"            
            })
            salaAtualizada.capacidade = capacidade

        if(Object.keys(salaAtualizada).length === 0){
        return res.status(400).json({
            sucesso: false,
            mensagem: "Nenhum campo para atualizar"
        })
    }
    await queryAsync('UPDATE sala SET ? WHERE id = ?', [salaAtualizada, id])
    res.json({
        sucesso: true,
        mensagem: "Sala Atualizada"
    })

    } catch (erro) {
        console.error('Erro ao atualizar sala: ', erro)
              res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar sala: ', 
                erro: erro.message
              })
    }
})

app.delete('/salas/:id', async (req,res) =>{
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sala inválido'
            })
        }
        const salaExiste = await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])

        if(salaExiste.length === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Sala não encontrada'
            })
        }
        await queryAsync('DELETE FROM sala WHERE id = ?', [id])
        res.json({
            sucesso: true,
            mensagem: "Sala excluída com sucesso"
        })
    } catch (erro) {
        console.error('Erro ao deletar a sala: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar sala',
            erro: erro.message
        })
    }
})

//sessoes

app.get('/sessoes', async(req,res) => {
    try{
        const sessoes = await queryAsync ('SELECT * FROM sessao')
        res.json({
            sucesso: true,
            dados: sessoes,
            total: sessoes.length
        })
    }catch (erro) {
        console.error('Erro ao listar as sessoes: ' , erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar as sessoes",
            erro: erro.message
        })
    }
})

app.get('/sessoes/:id', async (req,res) => {
    try{
        const {id} = req.params
        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Id de sessão inválido'
            })
        }
        const sessao = await queryAsync ('SELECT * FROM sessao WHERE id = ?', [id])
        if(sessao.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sessão não encontrada'
            })
        }
        res.json({
            sucesso: true,
            dados: sessao [0]
        })
    }catch (erro){
        console.error('Erro ao listar sessões: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar sessões',
            erro: erro.message
        })
    }
})

app.post('/sessoes', async (req,res) => {
    try{
        const {filme_id, sala_id, data_hora, preco} = req.body

        if(!filme_id || !sala_id  || !data_hora || !preco){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Informações obrigatórios faltando"
            })
        }
        if(filme_id !== undefined){
            if(isNaN(filme_id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID do filme não existe'
            })
        }
        if((await queryAsync('SELECT * FROM filme WHERE id = ?', [filme_id])).length == 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do filme não encontrado"
            })
        }
    }
    if(sala_id !== undefined) {
        if(isNaN(sala_id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sala é inválido',
            })
        }
        if((await queryAsync("SELECT * FROM sala WHERE id = ?", [sala_id])).lenght == 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sala não encontrado',
            })
        }
    }
    if(isNaN(preco) || preco < 0){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preço deve ser um número positivo'
        })
    }
    const novaSessao = {
        filme_id: filme_id,
        sala_id: sala_id,
        data_hora: data_hora,
        preco: preco
    }
    const resultado = await queryAsync("INSERT INTO sessao SET ?", novaSessao)

    res.status(201).json({
        sucesso: true,
        mensagem: 'Sessão criada',
        id: resultado.insertId
    })
    }
    catch(erro) {
        console.error('Erro ao cadastrar sala: ', erro)
            res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar sala',
            erro: erro.message
        }
           )
    }
    }
)

app.delete('/sessoes/:id', async (req,res) =>{
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sessão inválido'
            })
        }
        const sessaoExiste = await queryAsync ('SELECT * FROM sessao WHERE id = ?', [id])

        if(sessaoExiste.length === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Sessão não encontrada'
            })
        }
        await queryAsync('DELETE FROM sessao WHERE id = ?', [id])
        res.json({
            sucesso: true,
            mensagem: "Sessão excluída com sucesso"
        })
    } catch (erro) {
        console.error('Erro ao deletar a sessão: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar sessão',
            erro: erro.message
        })
    }
})

module.exports = app