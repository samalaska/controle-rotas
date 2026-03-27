let rotas = JSON.parse(localStorage.getItem("rotas")) || [];

function salvar() {
  localStorage.setItem("rotas", JSON.stringify(rotas));
  render();
}

function mostrarAba(id) {
  document.querySelectorAll("main section")
    .forEach(sec => sec.classList.add("hidden"));

  document.getElementById(id)
    .classList.remove("hidden");
}

function addRota() {
  const nome = document.getElementById("rotaInput").value;

  if (!nome) return;

  rotas.push({
    nome,
    notas:[]
  });

  document.getElementById("rotaInput").value="";
  salvar();
}

function addNota(index) {

  const nf = prompt("Número da Nota Fiscal:");

  if(!nf) return;

  rotas[index].notas.push({
    numero:nf,
    data:new Date(),
    recebido:false
  });

  salvar();
}

function receberNota(r,n){
  rotas[r].notas[n].recebido = true;
  salvar();
}

function diasPassados(data){
  const hoje = new Date();
  return Math.floor((hoje - new Date(data))/(1000*60*60*24));
}

function statusClasse(dias){
  if(dias >=7) return "bg-red-500 text-white";
  if(dias >=5) return "bg-yellow-400";
  return "bg-green-200";
}

function render(){

  const lista = document.getElementById("listaRotas");
  const prazos = document.getElementById("listaPrazos");

  lista.innerHTML="";
  prazos.innerHTML="";

  let pendentes=0;
  let atrasadas=0;

  rotas.forEach((rota,rIndex)=>{

    const div=document.createElement("div");
    div.className="bg-white p-4 rounded shadow mb-4";

    div.innerHTML=`
      <h3 class="font-bold text-lg">${rota.nome}</h3>
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

      const nf=document.createElement("div");
      nf.className=`p-2 mt-2 rounded flex justify-between ${statusClasse(dias)}`;

      nf.innerHTML=`
        NF ${nota.numero} - ${dias} dias
        ${!nota.recebido ?
        `<button onclick="receberNota(${rIndex},${nIndex})"
        class="bg-blue-600 text-white px-2 rounded">Recebido</button>`
        :"✅"}
      `;

      div.appendChild(nf);

      if(!nota.recebido){
        const clone=nf.cloneNode(true);
        prazos.appendChild(clone);
      }

    });

    lista.appendChild(div);
  });

  document.getElementById("totalRotas").innerText=rotas.length;
  document.getElementById("pendentes").innerText=pendentes;
  document.getElementById("atrasadas").innerText=atrasadas;
}

render();