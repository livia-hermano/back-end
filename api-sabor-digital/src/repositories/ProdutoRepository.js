const pool = require('../config/database')

class ProdutoRepository{
    async listarTodosProdutos(){
        const [listarTodosProdutos] = await pool.query ('SELECT * FROM produto')
        return listarTodosProdutos
    }
    async buscarPorId(id){
        const produto = await pool.query('SELECT * FROM produto WHERE id = ?', [id])

        return produto[0]
    }
    async cadastrarNovoProduto(dados){
        const {nome, descricao, preco, categoria, disponivel} = dados

        const [id] = await pool.query('INSERT INTO produto (nome, descricao, preco, categoria, disponivel) VALUES (?,?,?,?,?)', [nome,descricao, preco, categoria, disponivel])

        return id.insertId
    }
    async atualizarProdutoPorId(id, dados){
        const nomeCampo = []
        const valorCampo = []

        for(const [key, value] of Object.entries(dados)){
            nomeCampo.push(`${key} = ?`)
            valorCampo.push(value)
        }
        if(nomeCampo.length === 0) return null

        valorCampo.push(id)

        const query = `UPDATE produto SET ${nomeCampo.join('')} WHERE id = ?`
        const produtoAtualizado = await pool.query(query, valorCampo)

        return produtoAtualizado.affectedRows
    }
    async deletarProdutoPorId(id){
        const produto = await pool.query('DELETE FROM produto WHERE id = ? ', [id])

        return produto.affectedRows
    }
}

module.exports = new