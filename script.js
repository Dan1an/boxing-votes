gapi.client.init({
  apiKey: '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',
  clientId: '5003383808-ulp0onl2mn10qjb5lfuqcbqekrc50bsh.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
}).then(function () {
  console.error('Inicio del cliente exitoso');
}, function (error) {
  // Manejo del error de autenticación
  console.error('Error al inicializar el cliente:', error);
});

class Round {
  constructor(num, min, ptsA, ptsB) {
    this.num = num;
    this.min = min;
    this.ptsA = ptsA;
    this.ptsB = ptsB;
  }
  imprimirRound() {
    console.log("Round: " + this.num + ". " + "Minuto: " + this.min);
    console.log("Puntos Boxeador A: " + this.ptsA);
    console.log("Puntos Boxeador B: " + this.ptsB);
  }
}

class Tarjeta {
  constructor(
    boxerAName = 'A',
    boxerBname = 'B',
    numRounds = 12,
    roundsTime = 3,
    ptsXDerriboA = 0,
    ptsXFaltasA = 0,
    ptsXDerriboB = 0,
    ptsXFaltasB = 0
  ) {
    this.boxerAName = boxerAName;
    this.boxerBName = boxerBname;
    this.numRounds = numRounds;
    this.roundsTime = roundsTime;
    this.ptsXDerriboA = ptsXDerriboA;
    this.ptsXFaltasA = ptsXFaltasA;
    this.ptsXDerriboB = ptsXDerriboB;
    this.ptsXFaltasB = ptsXFaltasB;
    this.ptsFinalA = 0;
    this.ptsFinalB = 0;
    this.Rounds = new Array(numRounds * roundsTime);
    let cRound = 0;
    for (let i = 0; i < numRounds; i++) {
      for (let j = 0; j < roundsTime; j++) {
        this.Rounds[cRound] = new Round(i + 1, j + 1, 0, 0);
        cRound++;
      }
    }
  }
  imprimirTarjeta() {
    console.log("Boxeador A: " + this.boxerAName);
    console.log("Boxeador B: " + this.boxerBName);
    console.log("Numero de rounds: " + this.numRounds);
    console.log("Minutos por round: " + this.roundsTime);
    console.log("Puntos por derribos A: " + this.ptsXDerriboA);
    console.log("Puntos por derribos B: " + this.ptsXDerriboB);
    console.log("Puntos por faltas A: " + this.ptsXFaltasA);
    console.log("Puntos por faltas B: " + this.ptsXFaltasB);
    this.Rounds.forEach((element) => {
      element.imprimirRound();
    });
    console.log("Puntos totales A: " + this.ptsFinalA);
    console.log("Puntos totales B: " + this.ptsFinalB);
  }
  calcularPts() {
    let ptsA = 0;
    let ptsB = 0;
    this.Rounds.forEach((round) => {
      ptsA += round.ptsA;
      ptsB += round.ptsB;
    });
    this.ptsFinalA = ptsA + this.ptsXDerriboA + this.ptsXFaltasA;
    this.ptsFinalB = ptsB + this.ptsXDerriboB + this.ptsXFaltasB;
  }
}

document.getElementById("tarjetaForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const boxerAName = document.getElementById("boxerAName").value;
  const boxerBName = document.getElementById("boxerBName").value;
  const numRounds = parseInt(document.getElementById("numRounds").value);
  const roundsTime = parseInt(document.getElementById("roundsTime").value);

  const tarjeta = new Tarjeta(boxerAName, boxerBName, numRounds, roundsTime);

  document.getElementById("tarjetaForm").classList.add("hidden");

  consttarjetaInfo = document.getElementById("tarjetaInfo");
  tarjetaInfo.classList.remove("hidden");

  const puntuacion = document.getElementById("puntuacion");
  puntuacion.classList.remove("hidden");

  const botones = document.getElementById("botones");
  botones.classList.remove("hidden");

  const roundMin = document.getElementById("roundMin");
  let round = 1;
  let minuto = 1;
  roundMin.textContent = "Round " + round + ", Minuto " + minuto;

  document.getElementById("ganadorA").addEventListener("click", function () {
    tarjeta.Rounds[((round - 1) * tarjeta.roundsTime) + (minuto - 1)].ptsA++;
    siguienteMinuto();
  });

  document.getElementById("ganadorB").addEventListener("click", function () {
    tarjeta.Rounds[((round - 1) * tarjeta.roundsTime) + (minuto - 1)].ptsB++;
    siguienteMinuto();
  });

  document.getElementById("empate").addEventListener("click", function () {
    tarjeta.Rounds[((round - 1) * tarjeta.roundsTime) + (minuto - 1)].ptsA += 0.5;
    tarjeta.Rounds[((round - 1) * tarjeta.roundsTime) + (minuto - 1)].ptsB += 0.5;
    siguienteMinuto();
  });

  document.getElementById("derriboA").addEventListener("click", function () {
    tarjeta.ptsXDerriboA += tarjeta.roundsTime;
    //actualizarResultado();
  });

  document.getElementById("derriboB").addEventListener("click", function () {
    tarjeta.ptsXDerriboB += tarjeta.roundsTime;
    //actualizarResultado();
  });

  document.getElementById("faltaA").addEventListener("click", function () {
    tarjeta.ptsXFaltasA -= 0.5;
    //actualizarResultado();
  });

  document.getElementById("faltaB").addEventListener("click", function () {
    tarjeta.ptsXFaltasB -= 0.5;
    //actualizarResultado();
  });

  function siguienteMinuto() {
    minuto++;
    if (minuto > tarjeta.roundsTime) {
      minuto = 1;
      round++;
      if (round > tarjeta.numRounds) {
        // Todos los rounds y minutos han sido completados
        // Mostrar el resultado final de la pelea
        mostrarResultadoFinal();
        return;
      }
    }
    roundMin.textContent = "Round " + round + ", Minuto " + minuto;
  }

  function mostrarResultadoFinal() {
    tarjeta.calcularPts();
    const resultadoFinal = document.getElementById("resultadoFinal");
    resultadoFinal.textContent = "Resultado Final";
  
    const tarjetaInfo = document.createElement("div");
    tarjetaInfo.classList.add("tarjeta-info");
  
    const boxerA = document.createElement("p");
    boxerA.textContent = "Boxeador A: " + tarjeta.boxerAName;
    const boxerB = document.createElement("p");
    boxerB.textContent = "Boxeador B: " + tarjeta.boxerBName;
    const numRounds = document.createElement("p");
    numRounds.textContent = "Numero de rounds: " + tarjeta.numRounds;
    const roundsTime = document.createElement("p");
    roundsTime.textContent = "Minutos por round: " + tarjeta.roundsTime;
  
    tarjetaInfo.appendChild(boxerA);
    tarjetaInfo.appendChild(boxerB);
    tarjetaInfo.appendChild(numRounds);
    tarjetaInfo.appendChild(roundsTime);
  
    tarjeta.Rounds.forEach((round) => {
      const roundInfo = document.createElement("div");
      roundInfo.classList.add("round-info");
  
      const roundHeader = document.createElement("p");
      roundHeader.textContent = "Round: " + round.num + ". Minuto: " + round.min;
  
      const ptsA = document.createElement("p");
      ptsA.textContent = "Puntos Boxeador A: " + round.ptsA;
      const ptsB = document.createElement("p");
      ptsB.textContent = "Puntos Boxeador B: " + round.ptsB;
  
      roundInfo.appendChild(roundHeader);
      roundInfo.appendChild(ptsA);
      roundInfo.appendChild(ptsB);
  
      tarjetaInfo.appendChild(roundInfo);
    });
  
    const ptsDerriboA = document.createElement("p");
    ptsDerriboA.textContent = "Puntos por derribos A: " + tarjeta.ptsXDerriboA;
    const ptsDerriboB = document.createElement("p");
    ptsDerriboB.textContent = "Puntos por derribos B: " + tarjeta.ptsXDerriboB;
    const ptsFaltasA = document.createElement("p");
    ptsFaltasA.textContent = "Puntos por faltas A: " + tarjeta.ptsXFaltasA;
    const ptsFaltasB = document.createElement("p");
    ptsFaltasB.textContent = "Puntos por faltas B: " + tarjeta.ptsXFaltasB;
    const ptsTotalesA = document.createElement("p");
    ptsTotalesA.textContent = "Puntos totales A: " + tarjeta.ptsFinalA;
    const ptsTotalesB = document.createElement("p");
    ptsTotalesB.textContent = "Puntos totales B: " + tarjeta.ptsFinalB;
  
    tarjetaInfo.appendChild(ptsDerriboA);
    tarjetaInfo.appendChild(ptsDerriboB);
    tarjetaInfo.appendChild(ptsFaltasA);
    tarjetaInfo.appendChild(ptsFaltasB);
    tarjetaInfo.appendChild(ptsTotalesA);
    tarjetaInfo.appendChild(ptsTotalesB);
  
    resultadoFinal.appendChild(tarjetaInfo);
    resultadoFinal.classList.remove("hidden");
  
    // Ocultar elementos innecesarios
    puntuacion.classList.add("hidden");
    botones.classList.add("hidden");
  }
});


