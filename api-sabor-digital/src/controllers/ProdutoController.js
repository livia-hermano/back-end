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
        }catch (erro){

        }
    }
}
