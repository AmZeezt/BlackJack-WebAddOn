const potEl = document.getElementById("potEL");
const boardEl = document.getElementById("boardEl");
const actionsEL = document.getElementById("actionsEL");
const bankEL = document.getElementById("bankEL");

let POT = 0;
let cards = [];
let canAnother = true;
let canPass = true;
let renderFlag = true;
let playerScore = 0;
let croupierScore = 0;

const initiateGame = () => {
    let founds = localStorage.getItem("gameFounds");
    if (founds && founds !== "0") {
        return Number(founds);
    } else {
        localStorage.setItem("gameFounds", "300");
        return 100;
    }
}

const another = () => {
    if (!canAnother) {return}
    let card = Math.floor(Math.random() * 13) + 2;
    let color = Math.floor(Math.random() * 4);
    switch (color) {
        case 0:
            color = "club";
            break;
        case 1:
            color = "heart";
            break;
        case 2:
            color = "diamond";
            break;
        case 3:
            color = "spade";
            break;
    }
    if (card <= 10) {
        playerScore += card;
    } else if (card === 14) {
        playerScore += 11;
    } else {
        playerScore += 10;
    }
    cards.push(`${card}${color}`);
    console.log(cards);
    renderBetMenu();
    renderCards();
    if (playerScore > 21) {pass()}
}

const pass = () => {
    if (!canPass) {return}
    let card = Math.floor(Math.random() * 16) + 12;
    canAnother = false;
    canPass = false;
    renderBetMenu();
    if (playerScore > 21) {
        POT = "$LOSE";
    } else if (card > 21) {
        croupierScore += card;
        founds += POT * 2;
        POT = "$WIN";
    } else if (playerScore > card) {
        croupierScore += card;
        founds += POT * 2;
        POT = "$WIN";
    } else {
        croupierScore += card;
        POT = "$LOSE";
    }
    updateLocalStorage(founds);
    renderBetMenu();
    render();
}

const restart = () => {
    POT = 0;
    cards = [];
    canAnother = true;
    canPass = true;
    renderFlag = true;
    playerScore = 0;
    croupierScore = 0;
    renderBetMenu();
    another();
    renderCards();
    render();
}

const renderCards = () => {
    let margin = 10;
    let zIndex = 1;
    boardEl.innerHTML = "";
    cards.map(element => {
        boardEl.innerHTML += `<img src="/components/${element}.png" style="margin-top:${margin}px;z-index:${zIndex}" class="cardImg"/>`;
        margin += 40;
        zIndex += 1;
    })
}

const render = () => {
    potEl.innerHTML = `<img src="components/component1.png" id="pot"><p class="potText">POT</p><p class="potText">${POT}$</p>`;
    bankEL.innerHTML = `<p>BANK</p><p>${founds}</p>`;
}

const updateLocalStorage = (value) => {
    let updater = value.toString();
    localStorage.setItem("gameFounds", updater);
}

const addToPot = (value) => {
    if (founds >= value) {
        founds -= value;
        POT += value;
        updateLocalStorage(founds);
        render();
    }
}


const removeFromPot = (value) => {
    if (value <= POT) {
        founds += value;
        POT -= value;
        updateLocalStorage(founds);
        render();
    }
}

const bet = () => {
    renderFlag = false;
    renderBetMenu();
}

const renderBetMenu = () => {
    if (renderFlag) {
        actionsEL.innerHTML = `
        <button class="blueBtn" id="BET">BET<button/>
        <button class="greenBtn" id="10$">10$<button/>
        <button class="greenBtn" id="100$">100$<button/>
        <button class="greenBtn" id="200$">200$<button/>
        <button class="greenBtn" id="500$">500$<button/>
        <button class="greenBtn" id="1000$">1000$<button/>
        <button class="redBtn" id="-10$">-10$<button/>
        <button class="redBtn" id="-100$">-100$<button/>
        <button class="redBtn" id="-200$">-200$<button/>
        <button class="redBtn" id="-500$">-500$<button/>
        <button class="redBtn" id="-1000$">-1000$<button/>`;
        document.getElementById("BET").addEventListener("click", bet);
        document.getElementById("10$").addEventListener("click", () => {addToPot(10)});
        document.getElementById("100$").addEventListener("click", () => {addToPot(100)});
        document.getElementById("200$").addEventListener("click", () => {addToPot(200)});
        document.getElementById("500$").addEventListener("click", () => {addToPot(500)});
        document.getElementById("1000$").addEventListener("click", () => {addToPot(1000)});
        document.getElementById("-10$").addEventListener("click", () => {removeFromPot(10)});
        document.getElementById("-100$").addEventListener("click", () => {removeFromPot(100)});
        document.getElementById("-200$").addEventListener("click", () => {removeFromPot(200)});
        document.getElementById("-500$").addEventListener("click", () => {removeFromPot(500)});
        document.getElementById("-1000$").addEventListener("click", () => {removeFromPot(1000)});

    } else {
        actionsEL.innerHTML = `
        <button class="greenBtn" id="another">ANOTHER<button/>
        <button class="redBtn" id="pass">PASS<button/>
        <button class="gameIndicatorDiv"><p>SCORE</p><p>${playerScore}/21</p></button>
        <button class="gameIndicatorDiv"><p>CROUPIER</p><p>${croupierScore}/21</p></button>
        <button class="blueBtn" id="restart">RESTART<button/>`;
        document.getElementById("another").addEventListener("click", another);
        document.getElementById("pass").addEventListener("click", pass);
        document.getElementById("restart").addEventListener("click", restart);
    }
}

let founds = initiateGame();
render();
another();
renderBetMenu()