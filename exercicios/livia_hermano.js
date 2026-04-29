// ============================================================================
// MÉTODO PARA ATUALIZAR PRODUTO NO BANCO
// ============================================================================
//Lívia Hermano
const validarExistenciaProduto = (resultado, res, tipo) =>{
    if(resultado.length === 0){
            res.status(404).json({
                sucesso: false,
                mensagem: `${tipo} não encontrado`
    })
            return false
          }
        return true
    }

const validarDadosProduto = ({produto, valor}) =>{
    if(!produto || !valor){
        return "Nome do produto e seu valor são itens obrigatórios."
    }
    if(typeof valor !== 'number' || valor <=0){
        return "Valor inserido é inválido"
    }
    return null
}

app.put('/produtos/:id', async (req, res) => {
    try{
    const {id} = req.params
    const dados = req.body
    const produto = await queryAsync ("SELECT * FROM produtos WHERE id = ?", [id])
    const erro = validarDadosProduto(req.body)

    if(!validarExistenciaProduto [produto, res, "produto"]){
        return
    }

    if(Object.keys(dados).length === 0){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Nenhum dado foi enviado'
        })
    } 

    if (erro){
        return res.status(400).json({
            sucesso:false,
            mensagem: erro
        })
    }
    await queryAsync("UPDATE produtos SET ? WHERE id = ?", [dados, id])
    res.status(200).json({
        sucesso: true,
        mensagem: "O produto foi atualizado."
    })
    }catch(erro){
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar o produto.'
        })
    }
    
    }
)

