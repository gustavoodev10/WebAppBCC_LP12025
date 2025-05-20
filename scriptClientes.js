const formulario = document.getElementById("formCadCliente");
let listaDeClientes = [];

if (localStorage.getItem("clientes")){
    //recuperando do armazenamento local a lista de clientes
    listaDeClientes = JSON.parse(localStorage.getItem("clientes"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const cliente = {cpf,nome,telefone,cidade,uf,cep};
        listaDeClientes.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
        formulario.reset();
        mostrarTabelaClientes();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaClientes(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeClientes.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeClientes.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeClientes[i].cpf;
            linha.innerHTML=`
                <td>${listaDeClientes[i].cpf}</td>
                <td>${listaDeClientes[i].nome}</td>
                <td>${listaDeClientes[i].telefone}</td>
                <td>${listaDeClientes[i].cidade}</td>
                <td>${listaDeClientes[i].uf}</td>
                <td>${listaDeClientes[i].cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirCliente('${listaDeClientes[i].cpf}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirCliente(cpf){
    if(confirm("Deseja realmente excluir o cliente " + cpf + "?")){
        listaDeClientes = listaDeClientes.filter((cliente) => { 
            return cliente.cpf !== cpf;
        });
        localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
        document.getElementById(cpf).remove(); //excluir a linha da tabela
    }
}

mostrarTabelaClientes();