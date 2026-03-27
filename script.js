let rotas = JSON.parse(localStorage.getItem("rotas")) || [];

function salvar(){
localStorage.setItem("rotas", JSON.stringify(rotas));
}

/* ================= ABAS ================= */

function mostrarAba(nome){

["dashboard","rotas","prazos"].forEach(id=>{
document.getElementById("aba-"+id).style.display="none";
});

document.getElementById("aba-"+nome).style.display="block";

atualizarDashboard();
atualizarPrazos();
}

/* ================= ROTAS ================= */

function criarRota(){

const nome = rotaInput.value;
if(!nome) return;

rotas.push({nome, notas:[]});
rotaInput.value="";

salvar();
render();
}

function adicionarNota(i){

const numero = prompt("Número da NF:");
if(!numero) return;

rotas[i].notas.push({
numero,
data:new Date().toISOString(),
recebida:false,
dataRecebimento:null
});

salvar();
render();
}

function receberNota(r,n){

const nota = rotas[r].notas[n];
nota.recebida=true;
nota.dataRecebimento=new Date().toISOString();

salvar();
render();
}

function excluirRota(i){
rotas.splice(i,1);
salvar();
render();
}

function excluirNota(r,n){
rotas[r].notas.splice(n,1);
salvar();
render();
}

function render(){

const div=document.getElementById("rotas");
div.innerHTML="";

rotas.forEach((rota,r)=>{

let html=`
<div class="rota">
<h3>${rota.nome}</h3>
<button onclick="adicionarNota(${r})">+ Nota</button>
<button onclick="excluirRota(${r})">Excluir</button>
`;

rota.notas.forEach((nota,n)=>{

html+=`
<div class="nota">
NF ${nota.numero}
<div>
${nota.recebida?"✅":
`<button onclick="receberNota(${r},${n})">Receber</button>`}
<button onclick="excluirNota(${r},${n})">🗑</button>
</div>
</div>`;
});

html+="</div>";
div.innerHTML+=html;

});

atualizarDashboard();
atualizarPrazos();
}

/* ================= PRAZOS ================= */

function dias(data){
return Math.floor((new Date()-new Date(data))/(1000*60*60*24));
}

function atualizarPrazos(){

const painel=document.getElementById("painelPrazos");
painel.innerHTML="";

rotas.forEach(rota=>{
rota.notas.forEach(nota=>{

if(nota.recebida) return;

const d=dias(nota.data);
let cor="verde";

if(d>=5 && d<7) cor="amarelo";
if(d>=7) cor="vermelho";

painel.innerHTML+=`
<div class="nota ${cor}">
${rota.nome} — NF ${nota.numero}
(${d} dias)
</div>`;
});
});
}

/* ================= DASHBOARD INTELIGENTE ================= */

function atualizarDashboard(){

let emRota=0;
let vencendo=0;
let atrasadas=0;
let hoje=0;

const hojeData=new Date().toDateString();
const alertas=[];

rotas.forEach(rota=>{

let atrasosRota=0;

rota.notas.forEach(nota=>{

if(nota.recebida){

if(new Date(nota.dataRecebimento).toDateString()===hojeData)
hoje++;

return;
}

emRota++;

const d=dias(nota.data);

if(d>=5 && d<7) vencendo++;
if(d>=7){
atrasadas++;
atrasosRota++;
}

});

if(atrasosRota>0){
alertas.push(`${rota.nome} possui ${atrasosRota} atraso(s)`);
}

});

/* atualiza cards */
dashEmRota.innerText=emRota;
dashVencendo.innerText=vencendo;
dashAtrasadas.innerText=atrasadas;
dashHoje.innerText=hoje;

/* alertas */
const div=document.getElementById("alertasRotas");
div.innerHTML="";

alertas.forEach(a=>{
div.innerHTML+=`<div class="nota vermelho">${a}</div>`;
});

}

render();