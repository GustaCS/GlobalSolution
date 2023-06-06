document.querySelector("#salvar").addEventListener("click",cadastrar)
var results = document.getElementById('results')

let array_consumo =[]

window.addEventListener("load",()=>{
    array_consumo= JSON.parse(localStorage.getItem("array_consumo"))||[]
    atualizar()

})
window.addEventListener("load",()=>{
    array_resultados= JSON.parse(localStorage.getItem("array_resultados"))||[]
    atualizar()

})
document.querySelector("#busca").addEventListener("keyup",()=>{
    let busca = document.querySelector("#busca").value
    let filtra_consumo=array_consumo.filter((cons)=>{
        return cons.nome.toLowerCase().includes(busca.toLowerCase())
    })

    filtrar(filtra_consumo)
})
function qtde_domestico(valor){
    var contagemDomestico=0
    for(var d in valor){
        if(valor.hasOwnProperty(d)&& valor[d].tipo_consumo==="Domestico"){
            contagemDomestico++
        }
    }
   return contagemDomestico  
}
function qtde_corporativo(d){
    var qtdeCorporativo = 0
    for(var c in d){
        if(d.hasOwnProperty(c) && d[c].tipo_consumo==="Corporativo"){
            qtdeCorporativo++;
        }
    }
    return qtdeCorporativo
}
function somaPrecoDomestico(valor){
    var dPreco = 0
    for(var chave in valor){
        if(valor.hasOwnProperty(chave) && valor[chave].tipo_consumo==="Domestico"){
            dPreco +=valor[chave].preco
        }
    }
    return dPreco
}
function somaPrecoCorporativo(valor){
    var cPreco = 0
    for(var chave in valor){
        if(valor.hasOwnProperty(chave) && valor[chave].tipo_consumo==="Corporativo"){
            cPreco +=valor[chave].preco
        }
    }
    return cPreco
}
function filtrar(array_consumo){
    document.querySelector("#info_table").innerHTML =""
    array_consumo.forEach((registro)=>{
        document.querySelector("#info_table").innerHTML += createCard(registro)
    })
}

function atualizar(){
    document.querySelector("#info_table").innerHTML =""
    localStorage.setItem("array_consumo", JSON.stringify(array_consumo))
    array_consumo.forEach((registro)=>{
        document.querySelector("#info_table").innerHTML += createCard(registro)
    })
}

function cadastrar(){
    const nome  = document.querySelector('#nome').value
    const tipo_consumo= document.querySelector('#tipo_consumidor').value
    const consumo = document.querySelector("#consumo").value
    const data = document.querySelector("#data").value
    var dataParaFormatar = new Date(data)
    var dia = dataParaFormatar.getDate()+1
    var mes = dataParaFormatar.getMonth()+1
    var ano = dataParaFormatar.getFullYear()
    var dataFinal = dia + '/' + mes + '/' + ano 
    var preco = 0
    const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleModal'))

    if(tipo_consumo==="Domestico"){
        if(consumo <=50) preco=20 + (5*consumo)
    }else if(tipo_consumo ==="Corporativo") preco = 35+(15*consumo)
    
    const base_consumos = {
        id:Date.now(),
        nome,
        tipo_consumo,
        consumo,
        preco,
        dataFinal,
        concluida: false
    }
    if(!validar(base_consumos.nome,document.querySelector("#nome")))return
    if(!validar(base_consumos.consumo,document.querySelector("#consumo")))return

    if(tipo_consumo ==="Corporativo"){
        if(consumo<=200 && consumo>=0)
        array_consumo.push(base_consumos)
        atualizar()
        modal.hide()
    }else{
        modal.hide()
    }  

    if(tipo_consumo==="Domestico"){
        if(consumo<=30 && consumo>=0)
        array_consumo.push(base_consumos)
        atualizar()
        modal.hide()
    }else{
        modal.hide()
    }

}


function validar(valor,campo){
    //clean code
    if(valor==""){
        campo.classList.add("is-invalid")
        campo.classList.remove("is-valid")
        return false
    }

    campo.classList.remove("is-invalid")
    campo.classList.add("is-valid")
    return true
}
function apagar(id){
    array_consumo = array_consumo.filter((tarefa)=>{
        return tarefa.id != id
    })
    atualizar()
}
function createCard(base_consumos){
    return `
    <tr>
    <td>${base_consumos.nome}</td>
    <td>${base_consumos.tipo_consumo}</td>
    <td>${base_consumos.consumo}</td>
    <td>${base_consumos.preco}</td>
    <td>${base_consumos.dataFinal}</td>
    <td>
      <button type="button" onClick ="apagar(${base_consumos.id})" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exclusao_modal">Excluir</button>
      </td>
  </tr>`//template literals
}

function createResultados(dados){
    return`
    <div>
    <h3 class="text-center">Registros Corporativos</h3>
    <p class=" bg-primary-subtle text-center fs-2 fw-semibold">${dados.qtd_c}</p>
    <h3 class="text-center">Registros Domesticos</h3>
    <p class="bg-primary-subtle text-center fs-2 fw-semibold">${dados.qtd_d}</p>
    <h3 class="text-center">Media de Preços Corporativos</h3>
    <p class="bg-primary-subtle text-center fs-2 fw-semibold">R$${dados.mediaCorporativo}</p>
    <h3 class="text-center">Media de Preços Domesticos</h3>
    <p class="bg-primary-subtle text-center fs-2 fw-semibold">R$${dados.mediaDomestioco}</p>
  </div>`
}

results.addEventListener("click",()=>{
    var ls_dados=localStorage.getItem("array_consumo")
    var ObjetoResult= JSON.parse(ls_dados)

    var qtd_c = qtde_corporativo(ObjetoResult)
    var qtd_d = qtde_domestico(ObjetoResult)
    var valor_c = somaPrecoCorporativo(ObjetoResult)
    var valor_d = somaPrecoDomestico(ObjetoResult)
    var mediaCorporativo = 0
    var mediaDomestioco = 0
    if(qtd_c!==0){
        mediaCorporativo = valor_c/qtd_c
    }
    if(qtd_d!==0){
        mediaDomestioco = valor_d/qtd_d   
    }
    array_dadosResumo ={
        qtd_c,
        qtd_d,
        mediaCorporativo,
        mediaDomestioco
    }

    document.querySelector("#modal_resultados").innerHTML =""
    document.querySelector("#modal_resultados").innerHTML = createResultados(array_dadosResumo)

})