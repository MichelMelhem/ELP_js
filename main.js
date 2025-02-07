const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const motsMystere = [
    "Europe", "Cirque", "Virus", "Crocodile", "Moutarde", "Boussole", "Tempête", "Lanterne", "Pyramide", "Savane",
    "Astronaute", "Cascade", "Horizon", "Moustique", "Dragon", "Tornade", "Sculpture", "Trampoline", "Marathon", "Oasis",
    "Bouclier", "Phare", "Galaxie", "Baleine", "Espion", "Labyrinthe", "Montgolfière", "Volcan", "Igloo", "Serpent",
    "Télescope", "Rivière", "Parapluie", "Sorcier", "Girafe", "Planète", "Cactus", "Souterrain", "Sombrero", "Fusée",
    "Monastère", "Météore", "Corail", "Pirate", "Viaduc", "Pirogue", "Arc-en-ciel", "Caravane", "Méduse", "Geyser"
];
const propositions = [];
let tour = 0;
let cartesReussies = 0;
let nombreJoueurs;

function poserQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

function clearConsole() {
    process.stdout.write("\x1Bc");
}

async function initialiserJeu() {
    nombreJoueurs = parseInt(await poserQuestion("Combien de joueurs participent ? "), 10);
    if (isNaN(nombreJoueurs) || nombreJoueurs < 3) {
        console.log("Le nombre de joueurs doit être au minimum de 3.");
        process.exit(1);
    }
    console.log("Bienvenue dans Just One en mode texte !");
    await jouerTour();
}

async function jouerTour() {
    console.log(`\nTour ${tour + 1}`);
    const motMystere = motsMystere[tour % motsMystere.length];
    console.log(`Le mot mystère à deviner est :${motMystere} (Joueur actif ne regarde pas !)`);
    
    let indices = [];
    for (let i = 1; i < nombreJoueurs; i++) {
        await poserQuestion(`Joueur ${i}, appuyez sur Entrée pour saisir votre indice.`);
        clearConsole();
        let indice = await poserQuestion(`Joueur ${i}, entrez votre indice : `);
        indices.push(indice);
        clearConsole();
    }
    
    let occurrences = indices.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
    
    let indicesValides = indices.filter(word => occurrences[word] === 1);
    
    console.log("Indices valides :", indicesValides.join(", "));
    
    let proposition = await poserQuestion("Joueur actif, quelle est votre réponse ? ");

    if (proposition.toLowerCase() === motMystere.toLowerCase()) {
        console.log("Réussite ! Le mot mystère a été trouvé.");
        cartesReussies++;
    } else {
        console.log("Échec ! Le mot mystère n'a pas été trouvé.");
    }
    
    propositions.push({ motMystere, indices, indicesValides, proposition });
    
    fs.writeFileSync("propositions.json", JSON.stringify(propositions, null, 2));
    
    tour++;
    if (tour < motsMystere.length) {
        await jouerTour();
    } else {
        console.log("\nPartie terminée !");
        afficherScore();
        rl.close();
    }
}

function afficherScore() {
    console.log(`\nNombre de cartes réussies : ${cartesReussies}`);
    if (cartesReussies === 13) {
        console.log("Score parfait ! Y arriverez-vous encore ?");
    } else if (cartesReussies >= 11) {
        console.log("Incroyable ! Vos amis doivent être impressionnés !");
    } else if (cartesReussies >= 9) {
        console.log("Génial ! C’est un score qui se fête !");
    } else if (cartesReussies >= 7) {
        console.log("Waouh, pas mal du tout !");
    } else if (cartesReussies >= 4) {
        console.log("Vous êtes dans la moyenne. Arriverez-vous à faire mieux ?");
    } else {
        console.log("C’est un bon début. Réessayez !");
    }
}

initialiserJeu();
