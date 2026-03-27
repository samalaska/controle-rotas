let rotas = JSON.parse(localStorage.getItem("rotas")) || [];

function salvar(){
 localStorage.setItem("rotas",JSON.stringify(rotas));
 render();
}

function mostrarAba(id){
 document.querySelectorAll("section")
 .forEach(s=>s.classList.add("hidden"));

 document.getElementById(id).classList.remove("hidden");
}

/* =====================
CRIAR ROTA (ANTI DUPLICADA)
===================== */
function addRota(){

 const nome=document.getElementById("rotaInput").value.trim();
 if(!nome) return;

 if(rotas.some(r=>r.nome.toLowerCase()===nome.toLowerCase())){
  alert("⚠️ Rota já existe!");
  return;
 }

 rotas.push({nome,notas:[]});
 document.getElementById("rotaInput").value="";
 salvar();
}

function excluirRota(i){
 if(confirm("Excluir rota?")){
  rotas.splice(i,1);
  salvar();
 }
}

/* =====================
NOTAS
===================== */

function addNota(i){

 const nf=prompt("Número da NF:");
 if(!nf) return;

 rotas[i].notas.push({
  numero:nf,
  data:new Date(),
  recebido:false
 });

 salvar();
}

function excluirNota(r,n){
 rotas[r].notas.splice(n,1);
 salvar();
}

function receberNota(r,n){
 rotas[r].notas[n].recebido=true;
 rotas[r].notas[n].dataRecebido=new Date();
 salvar();
}

/* =====================
PRAZO
===================== */

function diasPassados(data){
 return Math.floor((new Date()-new Date(data))/(1000*60*60*24));
}

function corPrazo(d){
 if(d>=7) return "bg-red-500 text-white";
 if(d>=5) return "bg-yellow-300";
 return "bg-green-200";
}

/* =====================
RENDER + PESQUISA
===================== */

function render(){

 const busca=document.getElementById("pesquisa")?.value.toLowerCase()||"";

 const lista=document.getElementById("listaRotas");
 const prazos=document.getElementById("listaPrazos");

 lista.innerHTML="";
 if(prazos) prazos.innerHTML="";

 let pendentes=0;
 let atrasadas=0;
 let recebidasHoje=0;

 rotas.forEach((rota,rIndex)=>{

  const rotaMatch=rota.nome.toLowerCase().includes(busca);
  const nfMatch=rota.notas.some(n=>n.numero.includes(busca));

  if(busca && !rotaMatch && !nfMatch) return;

  const div=document.createElement("div");
  div.className="bg-white p-4 rounded shadow mb-4";

  div.innerHTML=`
   <div class="flex justify-between">
   <h3 class="font-bold">${rota.nome}</h3>
   <button onclick="excluirRota(${rIndex})"
   class="text-red-600">Excluir</button>
   </div>

   <button onclick="addNota(${rIndex})"
   class="bg-green-600 text-white px-3 py-1 rounded mt-2">
   + Nota
   </button>
  `;

  rota.notas.forEach((nota,nIndex)=>{

   const dias=diasPassados(nota.data);

   if(!nota.recebido){
    pendentes++;
    if(dias>=7) atrasadas++;
   }

   if(nota.dataRecebido){
    const hoje=new Date().toDateString();
    if(new Date(nota.dataRecebido).toDateString()===hoje)
     recebidasHoje++;
   }

   const nf=document.createElement("div");
   nf.className=`p-2 mt-2 rounded flex justify-between ${corPrazo(dias)}`;

   nf.innerHTML=`
   NF ${nota.numero} - ${dias} dias
   <div>
   ${!nota.recebido ?
   `<button onclick="receberNota(${rIndex},${nIndex})"
   class="bg-blue-600 text-white px-2 rounded">✔</button>`
   :"✅"}
   <button onclick="excluirNota(${rIndex},${nIndex})"
   class="text-red-700 ml-2">🗑</button>
   </div>
   `;

   div.appendChild(nf);

   if(!nota.recebido && prazos)
     prazos.appendChild(nf.cloneNode(true));
  });

  lista.appendChild(div);
 });

 document.getElementById("totalRotas").innerText=rotas.length;
 document.getElementById("pendentes").innerText=pendentes;
 document.getElementById("atrasadas").innerText=atrasadas;
 document.getElementById("recebidasHoje").innerText=recebidasHoje;
}

render();
