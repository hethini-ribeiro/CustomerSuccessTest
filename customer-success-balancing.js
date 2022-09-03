/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  let idCS, auxEmpateCS = 0, qtd=-1, qtdAux, indexAux = 0;
  
  customerSuccess = csAwayCheck(customerSuccess, customerSuccessAway);
  //ordenação da lista para ganhar performance na busca
  customerSuccess.sort(dynamicSort("score"));
  customers.sort(dynamicSort("score"));
  
  for (let i = 0; i < customerSuccess.length; i++) {
    qtdAux=0; // variavel auxiliar para contagem
    for (let j = indexAux; (j < customers.length) && (customers[j].score <= customerSuccess[i].score); j++) {
        qtdAux++;
        indexAux = j; //guardando index do ultimos cliente atendido
    }
    if (qtd < qtdAux) { // confirmação se surgiu algum CS com mais clientes
      qtd = qtdAux;
      idCS = customerSuccess[i].id; //guardando id do CS com + clientes
      auxEmpateCS = 0; //flag de controle de empate
    }
    else if(qtd === qtdAux) {
      auxEmpateCS++; //flag ativada por haver empate
    }
  }
  
  return auxEmpateCS != 0? 0 : idCS; //se tiver empate retorna 0 e se não houver, retorna o id do CS
}

// função que retira os ausentes da lista de CS
function csAwayCheck(csList,csAway) {
  csList.sort(dynamicSort("id"));
  csAway.sort();
    for (let i = 0; i < csList.length; i++) {
      // for com condição de parada (<=), evitando percorrer todo o array
      for (let index = 0; index < csAway.length && csList[i].id <= csAway[index]; index++) {
        if (csList[i].id === csAway[index]) {
          csList.splice(i,1); // limpando a lista de CS, retirando aqueles ausentes
        }
      }      
    }
    
    return csList; //retorno da lista de CS só com pessoas ativas
}

// ordenação do array de objetos usando score como parametro
function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});
