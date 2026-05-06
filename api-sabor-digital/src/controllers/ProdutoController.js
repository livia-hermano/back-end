const ProdutoService = require('../services/ProdutoService')

class ProdutoController{
    async listar(req, res){
        try{
            const resultado = await ProdutoService.listarProdutos()
            res.json(resultado)

        }catch (error){
            res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem || 'Erro interno do servidor',
                erro: erro   
            })
        }
    }
    async buscarPorId(req, res){
        try{
            const resultado = await ProdutoService.buscarProdutoPorId(req.params.id)
            res.json(resultado)
        }catch (erro){
             res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem || 'Erro interno do servidor',
                erro: erro 
        })
    }
}
    async cadastrar(req, res){
        try{
            const resultado = await ProdutoService.cadastrarProduto(req.body)
            res.status(201).json(resultado)
        }catch (erro){
            res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem || 'Erro interno do servidor',
                erro: erro })
        }
    }
    async atualizar(req, res){
        try{
            const resultado = await ProdutoService.atualizarProduto(req.params.id, req.body)
            res.status(200).json(resultado)
        }catch (erro){
            res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem || 'Erro interno do servidor',
                erro: erro })
        }
    }
    async deletar(req, res){
        try{
            const resultado = await ProdutoService.deletarProduto(req.params.id)
            res.status(200).json(resultado)
        }catch (erro){
            res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem || 'Erro interno do servidor',
                erro: erro })
        }
    }
}

module.exports = new ProdutoController()