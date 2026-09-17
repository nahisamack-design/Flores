document.addEventListener('DOMContentLoaded', () => {
  animarTitulo();
  iniciarEstrellas();
  crearOrbitas();
  crearPetalosGirasol();
  crearLluviaDePetalos();
  crearCampoDeGirasoles();
  sembrarFrases();
  observarCarta();
  configurarBotonReinicio();
  configurarMusica();
});

/* ============ TITULO letra por letra ============ */
function animarTitulo() {
  const h1 = document.getElementById('tituloAnimado');
  const texto = h1.textContent;
  h1.textContent = '';
  [...texto].forEach((caracter, i) => {
    const span = document.createElement('span');
    span.className = 'letra';
    span.style.setProperty('--i', i);
    span.textContent = caracter === ' ' ? '\u00A0' : caracter;
    h1.appendChild(span);
  });
}

/* ============ ESTRELLAS + ESTRELLAS FUGACES ============ */
function iniciarEstrellas() {
  const canvas = document.getElementById('estrellas');
  const ctx = canvas.getContext('2d');
  let estrellas = [];
  let fugaces = [];

  function ajustarTamano() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    crearEstrellas();
  }

  function crearEstrellas() {
    const cantidad = Math.floor((canvas.width * canvas.height) / 3800);
    estrellas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radio: Math.random() * 1.5 + 0.3,
      fase: Math.random() * Math.PI * 2,
      velocidad: 0.4 + Math.random() * 0.9
    }));
  }

  function talVezLanzarFugaz() {
    if (Math.random() < 0.006 && fugaces.length < 2) {
      const y0 = Math.random() * canvas.height * 0.5;
      fugaces.push({
        x: Math.random() * canvas.width * 0.4,
        y: y0,
        vx: 6 + Math.random() * 4,
        vy: 2.5 + Math.random() * 2,
        vida: 1
      });
    }
  }

  function dibujarFugaces() {
    fugaces.forEach(f => {
      const grad = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 8, f.y - f.vy * 8);
      grad.addColorStop(0, `rgba(255, 244, 214, ${f.vida})`);
      grad.addColorStop(1, 'rgba(255, 244, 214, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(f.x - f.vx * 8, f.y - f.vy * 8);
      ctx.stroke();

      f.x += f.vx;
      f.y += f.vy;
      f.vida -= 0.02;
    });
    fugaces = fugaces.filter(f => f.vida > 0 && f.x < canvas.width + 50 && f.y < canvas.height + 50);
  }

  function dibujar(tiempo) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    estrellas.forEach(e => {
      const brillo = 0.35 + 0.65 * Math.abs(Math.sin(tiempo * 0.0006 * e.velocidad + e.fase));
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 244, 214, ${brillo.toFixed(2)})`;
      ctx.fill();
    });

    talVezLanzarFugaz();
    dibujarFugaces();

    requestAnimationFrame(dibujar);
  }

  window.addEventListener('resize', ajustarTamano);
  ajustarTamano();
  requestAnimationFrame(dibujar);
}

/* ============ PUNTOS ORBITANDO EL PORTAL ============ */
function crearOrbitas() {
  const contenedor = document.getElementById('orbitas');
  const radios = [95, 130, 165];

  radios.forEach((radio, i) => {
    const puntos = 3 + i;
    for (let j = 0; j < puntos; j++) {
      const punto = document.createElement('div');
      punto.className = 'punto-orbital';
      const duracion = 14 + i * 6;
      const retrasoInicial = (j / puntos) * duracion;
      punto.style.setProperty('--radio', `${radio}px`);
      punto.style.animationDuration = `${duracion}s`;
      punto.style.animationDelay = `-${retrasoInicial}s`;
      contenedor.appendChild(punto);
    }
  });
}

/* ============ GIRASOL CENTRAL: pétalos generados uno por uno ============ */
function crearPetalosGirasol() {
  const contenedor = document.getElementById('petalosContenedor');
  const cantidadPetalos = 14;

  for (let i = 0; i < cantidadPetalos; i++) {
    const angulo = (360 / cantidadPetalos) * i;
    const petalo = document.createElement('div');
    petalo.className = 'petalo';
    petalo.style.setProperty('--angulo', `${angulo}deg`);
    petalo.style.setProperty('--orden', i);
    contenedor.appendChild(petalo);
  }
}

/* ============ LLUVIA DE PETALOS FLOTANTES ============ */
function crearLluviaDePetalos() {
  const contenedor = document.getElementById('lluvia-petalos');
  const simbolos = ['🌼', '✦', '❋'];
  const cantidad = window.innerWidth < 480 ? 10 : 18;

  for (let i = 0; i < cantidad; i++) {
    const petalo = document.createElement('span');
    petalo.className = 'petalo-cae';
    petalo.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    petalo.style.left = `${Math.random() * 100}%`;
    petalo.style.fontSize = `${0.6 + Math.random() * 0.9}rem`;
    const duracionCaida = 14 + Math.random() * 12;
    const duracionBalanceo = 3 + Math.random() * 3;
    petalo.style.animationDuration = `${duracionCaida}s, ${duracionBalanceo}s`;
    petalo.style.animationDelay = `${-Math.random() * duracionCaida}s, ${-Math.random() * duracionBalanceo}s`;
    petalo.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
    contenedor.appendChild(petalo);
  }
}

/* ============ CAMPO DE GIRASOLES AL HORIZONTE ============ */
function crearCampoDeGirasoles() {
  const contenedor = document.getElementById('campoGirasoles');
  const cantidad = window.innerWidth < 480 ? 9 : 15;

  for (let i = 0; i < cantidad; i++) {
    const flor = document.createElement('div');
    flor.className = 'flor-campo';
    const tamano = 24 + Math.random() * 28;
    flor.style.width = `${tamano}px`;
    flor.style.setProperty('--dur', `${4 + Math.random() * 3}s`);
    flor.style.setProperty('--retraso', `${i * 0.08}s`);

    const cabeza = document.createElement('div');
    cabeza.className = 'cabeza';
    const tallo = document.createElement('div');
    tallo.className = 'tallo-campo';

    flor.appendChild(cabeza);
    flor.appendChild(tallo);
    contenedor.appendChild(flor);
  }
}

/* ============ FRASES FLOTANTES PERSONALIZADAS ============ */
function sembrarFrases() {
  const contenedor = document.getElementById('frases');

  const frases = [
    { texto: 'Mi mejor amiga', dorada: true },
    { texto: 'Mi compañera de gym', dorada: false },
    { texto: 'La arquitecta más grande', dorada: true },
    { texto: 'Luz en mis días', dorada: false },
    { texto: 'Eres pura alegría', dorada: true },
    { texto: 'Siempre presente', dorada: false },
    { texto: 'Fuerza y buena vibra', dorada: true },
    { texto: 'Flores para ti', dorada: false },
    { texto: 'Gracias por tanto', dorada: true },
    { texto: 'Mariangeles', dorada: false },
    { texto: 'Mi persona favorita', dorada: true },
    { texto: 'Constante en mi vida', dorada: false }
  ];

  const posiciones = [
    { top: '2%',  left: '4%'  }, { top: '6%',  left: '62%' },
    { top: '16%', left: '30%' }, { top: '18%', left: '78%' },
    { top: '28%', left: '6%'  }, { top: '32%', left: '48%' },
    { top: '44%', left: '20%' }, { top: '46%', left: '70%' },
    { top: '58%', left: '2%'  }, { top: '60%', left: '55%' },
    { top: '72%', left: '25%' }, { top: '74%', left: '75%' }
  ];

  frases.forEach((f, i) => {
    const el = document.createElement('span');
    el.className = 'frase' + (f.dorada ? ' dorada' : '');
    el.textContent = f.texto;
    const pos = posiciones[i % posiciones.length];
    el.style.top = pos.top;
    el.style.left = pos.left;
    el.style.setProperty('--retraso', `${i * 0.22}s`);
    contenedor.appendChild(el);
  });
}

/* ============ CARTA FINAL: aparece al hacer scroll hasta ella ============ */
function observarCarta() {
  const carta = document.querySelector('.carta');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) carta.classList.add('visible');
    });
  }, { threshold: 0.35 });
  observador.observe(carta);
}

/* ============ BOTON "REVIVIR LA MAGIA": reinicia las animaciones de entrada ============ */
function configurarBotonReinicio() {
  const boton = document.getElementById('botonReiniciar');
  boton.addEventListener('click', () => {
    const girasol = document.getElementById('girasolCentral');
    const titulo = document.getElementById('tituloAnimado');
    const subtitulo = document.getElementById('subtituloAnimado');

    [girasol, titulo, subtitulo, ...document.querySelectorAll('.petalo, .centro-flor, .tallo, .hoja, .frase')]
      .forEach(el => {
        el.style.animation = 'none';
      });

    // Forzar reflow para poder reiniciar las animaciones
    void girasol.offsetWidth;

    [girasol, titulo, subtitulo, ...document.querySelectorAll('.petalo, .centro-flor, .tallo, .hoja, .frase')]
      .forEach(el => {
        el.style.animation = '';
      });

    document.querySelector('.portal-escena').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============ MUSICA DE FONDO (opcional) ============ */
function configurarMusica() {
  const audio = document.getElementById('musicaFondo');
  const boton = document.getElementById('botonMusica');

  boton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          boton.textContent = '🔊';
          boton.classList.add('activo');
        })
        .catch(() => {
          // Si no hay un archivo musica.mp3 en la carpeta, simplemente no suena.
          boton.textContent = '🔈';
        });
    } else {
      audio.pause();
      boton.textContent = '🔈';
      boton.classList.remove('activo');
    }
  });
}