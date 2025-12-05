const express = require("express")
const router = express.Router()
const Instituicao = require("../models/Instituicao")


//criar instituição no thunder ou postman por meio do post e mandar para o mongodb
router.post("/criar", async (req,res)=>{
    try{
        const novaInstituicao = await Instituicao.create(req.body);
        res.status(201).json(novaInstituicao);
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

//filtrar as instituições que constam no mongodb
router.post("/filtrar", async (req,res)=>{
    const{
        estado,
        municipio,
        faixaetaria,
        abordagem,
        prontoatendimento
    } = req.body


    let filtro = {}
    
    if(estado) filtro.estado = estado
    if(municipio) filtro.municipio = municipio
    if(faixaetaria) filtro.faixaetaria = faixaetaria
    if(abordagem) filtro.abordagem = abordagem
    if(prontoatendimento) filtro.prontoatendimento = prontoatendimento

    try{
        const lista = await Instituicao.find(filtro)
        res.json(lista)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
})

module.exports = router;