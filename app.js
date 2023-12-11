/*
──────────────▒███░───░████████▒
───────────█████▒░█████░▒▒▒▒▒▒█████
──────────██▒▒▒▒██████████████▒▒▒██░
─────────██▒▒▒▒███▒██▒██▒▒█████▒░▒██
─────────█░▒▒▒██▒████████████▒█▒▒▒█░
─────────█▒▒▒▒██▒▒▒░▓▓▒░▓▒▒████▒▒██
─────────█▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒█▒█░▒████
─────███████████▒▒▒▒▒▒▒▒██████▒██▓▒███
─────██▒▒▒▒▒▒█████▒▒▒▒▒▒▒▒█████▒▒▒▒▒██
───────██▒▒▒▒▒▒▒▓██████▒▒▒▒▒██▒▒▒▒▒▒███
────█████▒▒▒▒▒▒▒▒▒▒████▒▒▒██▒▒▒▒▒▒███
────██▒▒▒███▒▒▒▒▒▒▒▒▒▒▓█████▒▒▒▒▒███
────███▒▒▒▒███▒▒▒▒▒▒▒▒▒▒▒███▓▒▒███
──────█████▒▒████▒▒▒▒▒▒▒▒▒▒█████
─────────████▒▒██████▒▒▒▒█████
────────────███▒▒██████████
──────────────████▓──█▓█
────────────────────████
────────────────────█░█─────█████████
────────────────────█▓█───█████████████
──░█████████───────████──██▓███▒▓████
─█████████████─────█░███████░██████
───████░▒███▒██────█▓██████████
─────█████▓▒█████─████
─────────██████████▓█
──────────────────█▓█────████▒█▓▒█
─────────────────█▓██──█████████████
─────────────────█▓█──██▒████░█████
────────────────██████████▒██████
────────────────█▓███████████
───────────────████
───────────────█▒█
───────────────███
*/

const YYYY = document.getElementById('YYYY');
const AA = document.getElementById('AA');
const PP = document.getElementById('PP');
const AT = document.getElementById('AT');
const DDD = document.getElementById('DDD');
const SP = document.getElementById('SP');
const ISP = document.getElementById('ISP')
const enviar = document.getElementById('gerar');
const apagar = document.getElementById('reset');
const Ret = document.getElementById('Ret');
const AAP = document.getElementById('AAP');

let rows;

// Desabilita o elemento select
const selects = document.querySelectorAll("select");
selects.forEach(select => select.disabled = true);
document.getElementById("ISP").disabled = true;

window.addEventListener('load', function() {
  document.querySelector('.box').style.display = 'flex';
  fetch('depara.json')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response from the server
      rows = data;

      const optionsAAP = ['Atividade PGD'];
      const valuesAAP = [''];
      for (let i = 0; i < rows.length; i++) {
        const numAtividade = rows[i]['nº da atividade'];
        let atividadePGD = rows[i]['Atividade PGD'];
        let atividade2 = rows[i]['Atividade2'];
        if (numAtividade === undefined || atividadePGD === undefined) {
          break;
        }
        atividadePGD = fixText(atividadePGD);
        const numAtividadeFormatted = numAtividade.toString().padStart(2, '0');
        const optionText = `${atividade2.toUpperCase()}-${numAtividadeFormatted} ${atividadePGD}`;
        if (numAtividade && atividadePGD && !optionsAAP.includes(optionText)) {
          optionsAAP.push(optionText);
          valuesAAP.push(numAtividade);
        }
      }
      for (let i = 0; i < optionsAAP.length; i++) {
        const option = document.createElement("option");
        option.text = optionsAAP[i];
        option.value = valuesAAP[i];
        if (isNaN(option.value)) { option.value = ''; }
        AAP.add(option);
      }

      // Enable AAP select
      document.getElementById("AAP").disabled = false;
      document.querySelector('.box').style.display = 'none';
      
      AAP.addEventListener('change', function() {
        // Clear DDD options
        DDD.innerHTML = '';

        // Filter rows based on selected AAP value

        const selectedNumAtividade = AAP.value; // Assuming AAP is the select element
        const selectedAtividade2 = AAP.options[AAP.selectedIndex].text.split(/-|\s+/)[0]; // Assuming AAP is the select element
        console.log('Selected Atividade2:', selectedAtividade2);
        console.log('Selected NumAtividade:', selectedNumAtividade);
        
        const filteredRows = rows.filter(row => {
          const numAtividade = row['nº da atividade'];
          const atividade2 = row['Atividade2'];
        
          // Check if both atividade2 and numAtividade match
          return atividade2.toLowerCase() === selectedAtividade2.toLowerCase() && numAtividade === selectedNumAtividade;
        });
        
        // Populate DDD options
        const optionsDDD = ['Tipo de Demanda'];
        const valuesDDD = [''];
        for (let i = 0; i < filteredRows.length; i++) {
          const codDemanda = filteredRows[i].CodDemanda;
          let tipoDemanda = filteredRows[i]['Tipo de Demanda'];
          if (codDemanda === undefined || tipoDemanda === undefined) {
            break;
          }
          tipoDemanda = fixText(tipoDemanda);
          if (codDemanda && tipoDemanda && !optionsDDD.includes(tipoDemanda)) {
            optionsDDD.push(tipoDemanda);
            valuesDDD.push(codDemanda);
          }
        }
        for (let i = 0; i < optionsDDD.length; i++) {
          const option = document.createElement("option");
          option.text = optionsDDD[i];
          option.value = valuesDDD[i];
          if (isNaN(option.value)) { option.value = ''; }
          DDD.add(option);
        }

        // Enable DDD select
        document.getElementById("DDD").disabled = false;
      });

      document.querySelector('.box').style.display = 'none';
    });
});

AAP.addEventListener('change', function() {  
  clearElement(DDD);
  clearElement(AT);
  clearElement(PP);
  clearElement(YYYY);
  clearElement(AA);
  clearElement(SP);
  clearElement(ISP);
});

// AT
DDD.addEventListener('change', function() {

  clearElement(AT);
  clearElement(PP);
  clearElement(YYYY);
  clearElement(AA);
  clearElement(SP);
  clearElement(ISP);

  if (DDD.value != '' ) {
    
    // Enable AT select
    document.getElementById("AT").disabled = false;

    // Filter rows by selected DDD value
    const filteredRows = rows.filter(row => row.CodDemanda == this.value);

    // Populate AT options
    const optionsAT = ['Atividade'];
    const valuesAT = [''];
    for (let i = 0; i < filteredRows.length; i++) {
      const codAtividade = filteredRows[i].CodAtividade;
      let atividade = filteredRows[i].Atividade;
      if (codAtividade === undefined && atividade === undefined) {
        break;
      }
      if (atividade === '-') {
        atividade = '';
      }
      if (codAtividade === '-') {
        codAtividade = '';
      }
      if ((codAtividade && atividade !== undefined && !optionsAT.includes(atividade)) && (codAtividade !== undefined && atividade !== undefined)) {
        optionsAT.push(atividade);
        valuesAT.push(codAtividade);
      }
    }
    // Sort options by value
    const sortedOptions = optionsAT.map((option, index) => ({ text: option, value: valuesAT[index] }))
      .sort((a, b) => a.value - b.value);

    // Add sorted options to AT
    for (let i = 0; i < sortedOptions.length; i++) {
      const option = document.createElement("option");
      option.text = sortedOptions[i].text;
      option.value = sortedOptions[i].value;
      AT.add(option);
    }
  } else {
    clearElement(AT);
  }
});

// PP
AT.addEventListener('change', function() {

  clearElement(PP);
  clearElement(YYYY);
  clearElement(AA);
  clearElement(SP);
  clearElement(ISP);
  
  if (AT.value !== '' && DDD.value !== '') {
    // Enable PP select
    document.getElementById("PP").disabled = false;

    // Filter rows by selected DDD and AT values
    const filteredRows = rows.filter(row => row.CodDemanda == DDD.value && row.CodAtividade == this.value);

    // Populate PP options
    const optionsPP = ['Produto'];
    const valuesPP = [''];
    for (let i = 0; i < filteredRows.length; i++) {
      const codProduto = filteredRows[i].CodProduto;
      let produto = filteredRows[i].Produto;
      if (codProduto === undefined && produto === undefined) {
        break;
      }
      if (produto === '-') {
        produto = '';
      }
      if (codProduto === '-') {
        codProduto = '';
      }
      if ((codProduto && produto !== undefined && !optionsPP.includes(produto)) && (codProduto !== undefined && produto !== undefined)) {
        optionsPP.push(produto);
        valuesPP.push(codProduto);
      }
    }

    // Add empty option if PP would be empty
    if (optionsPP.length === 1) {
      optionsPP.push('');
      valuesPP.push('');
    }

    // Sort options by value
    const sortedOptions = optionsPP.map((option, index) => ({ text: option, value: valuesPP[index] }))
      .sort((a, b) => a.value - b.value);

    // Add sorted options to PP
    for (let i = 0; i < sortedOptions.length; i++) {
      const option = document.createElement("option");
      option.text = sortedOptions[i].text;
      option.value = sortedOptions[i].value;
      PP.add(option);
    }
  } else {
  clearElement(PP);
  }
});

PP.addEventListener('change', function() {

  clearElement(YYYY);
  clearElement(AA);
  clearElement(SP);
  clearElement(ISP);

  if (PP.value !== '' && AT.value !== '' && DDD.value !== '') {

    document.getElementById("gerar").removeAttribute("disabled");

    var ano, acao, sprint;

    if ([1, 2, 3, 4].includes(Number(DDD.value))) {

      fetch('sprint.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          sprint = data;

          // Create and append the options to the select element
          sprint.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            SP.add(option);
          });

        })
        .catch(error => {
          // Handle errors here
          console.error("Erro sprint.json: ", error);
        });

      fetch('ano.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          ano = data;

          // Create and append the options to the select element
          ano.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            YYYY.add(option);
          });
        })
        .catch(error => {
          // Handle errors here
          console.error("Erro ano.json: ", error);
        });
      if (DDD.value == 1) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = true;
      }
      if ([2, 3, 4].includes(Number(DDD.value))) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = false;
      }
    } else if (DDD.value == 5) {
      document.getElementById("YYYY").disabled = false;
      document.getElementById("SP").disabled = true;
      let tasksSelect = document.getElementById("IPP");
      fetch('ano.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          ano = data;

          // Create and append the options to the select element
          ano.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            YYYY.add(option);
          });
        })
        .catch(error => {
          // Handle errors here
          console.error("Erro ano.json: ", error);
        });
      fetch('idEaudMonitoramento.json')
        .then(response => response.json())
        .then(data => {
          // Populate select element with data from JSON file
          for (let task in data) {
            let option = document.createElement("option");
            option.text = task;
            tasksSelect.add(option);
          }
        });
      document.getElementById("IPP").disabled = false;
    }
  } else {
    clearElement(YYYY);
    clearElement(AA);
    clearElement(SP); 
  }

  clearElement(ISP);

  if (([2, 3, 4].includes(Number(DDD.value)))) {
    document.getElementById("ISP").disabled = false;
  } else if (DDD.value === 5) {
    document.getElementById("ISP").disabled = false;
  } else { document.getElementById("ISP").disabled = true; }
});

YYYY.addEventListener('change', function() {

  AA.innerHTML = '';

  if (!(DDD.value == 6 || DDD.value == 10 || DDD.value == 8 && AT.value == 1 || (DDD.value == 9 && [4, 5, 6].includes(Number(AT.value))))){
  if ((AT.value == 3 || AT.value == 2) && DDD.value == 1) {
    document.getElementById("AA").disabled = true;
  } else {
    if (![12, 13, 14].includes(Number(DDD.value))) {
    fetch('acao.json')
      .then(response => response.json())
      .then(data => {
        // Use the data here
        acao = data;

        // Filter acao by selected YYYY value
        const filteredAcao = acao.filter(item => item.year == YYYY.value);

        // Create and append the options to the AA select element
        filteredAcao.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.text;
          AA.add(option);
        });
        document.getElementById("AA").disabled = false;
      })
      .catch(error => {
        // Handle errors here
        console.error("Erro acao.json: ", error);
      });
    }
  }
}
});

// Adiciona um evento de clique 
enviar.addEventListener("click", function(event) { // Previne o comportamento padrão do botão 
  event.preventDefault();

  // Aqui começa o seu código 
  const PAA = AA.value; const PYYYY = YYYY.value; const PPP = PP.value; const PDDD = DDD.value; const PAT = AT.value; const PSP = SP.value; const PISP = ISP.value

  Ret.value = ('<demanda>' + PDDD + '</demanda><atividade>' + PAT + '</atividade><produto>' + PPP + '</produto><idEaud>' + PISP + '</idEaud><anoAcao>' + PYYYY + '</anoAcao><idAcao>' + PAA + '</idAcao><idSprint>' + PSP + '</idSprint>')
});

apagar.addEventListener("click", event => {
  event.preventDefault()
  AA.value = ''
  YYYY.value = ''
  PP.value = ''
  DDD.value = ''
  AT.value = ''
  SP.value = ''
  ISP.value = ''
  Ret.value = ''
  AT.text = ''
  PP.text = ''

  // Desabilita o elemento select
  const selects = document.querySelectorAll("select");
  selects.forEach(select => select.disabled = true);
  document.getElementById("ISP").disabled = true;
  document.getElementById("DDD").disabled = true;
  document.getElementById("AAP").disabled = false;
});

function copiarResultado() {
  if (Ret.value == "") return;

  Ret.select();
  navigator.clipboard.writeText(Ret.value);
}

function fixText(text) {
  // Define a dictionary of special characters to replace
  const replacements = {
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã©': 'é',
    'Ãª': 'ê',
    'Ã³': 'ó',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ãº': 'ú',
    'Ã§': 'ç'
  };

  // Replace any occurrences of special characters in the text
  for (const [old, newChar] of Object.entries(replacements)) {
    text = text.split(old).join(newChar);
  }

  return text;
}

function clearElement(element) {
  element.innerHTML = '';
  element.disabled = true;
}