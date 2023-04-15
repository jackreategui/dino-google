let time = new Date();
let deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

let sueloY = 22;
let velY = 0;
let impulso = 900;
let gravedad = 2500;

let dinoPosX = 42;
let dinoPosY = sueloY;

let sueloX = 0;
let velEscenario = 1280 / 3;
let gameVel = 1;
let score = 0;

let parado = false;
let saltando = false;

let tiempoHastaObstaculo = 2;
const tiempoObstaculoMin = 0.7;
const tiempoObstaculoMax = 1.8;
let obstaculoPosY = 16;
const obstaculos = [];

let contenedor;
let dino;
let textoScore;
let suelo;
let gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener('keydown', HandleKeyDown);
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        Saltar();
    }

}

function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function Update() {
    MoverSuelo();
    MoverDinosaurio();
    DecidirCrearObstaculo();
    MoverObstaculos()

    velY -= gravedad * deltaTime;
}

function MoverSuelo() { 
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + 'px';
}

function CalcularDesplazamiento() { 
    return velEscenario * deltaTime * gameVel;

}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if (dinoPosY <  sueloY) {
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY + 'px';
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add('dino-corriendo');
    }
    saltando = false;
}

function DecidirCrearObstaculo() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add('cactus');
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) /gameVel;
}

function MoverObstaculos() {
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + 'px';
        }
        
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
}