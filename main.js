const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const motsMystere = ["Europe", "Cirque", "Virus", "Crocodile", "Moutarde"];
const propositions = [];
let tour = 0;

function poserQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function jouerTour() {
    console.log(`\nTour ${tour + 1}`);
    const motMystere = motsMystere[tour % motsMystere.length];
    console.log(`Le mot mystère à deviner est : ${motMystere} (Joueur actif ne regarde pas !)`);
    
    let indices = [];
    for (let i = 1; i <= 5; i++) {
        let indice = await poserQuestion(`Joueur ${i}, entrez votre indice : `);
        indices.push(indice);
    }
    
    // Suppression des indices identiques
    let occurrences = indices.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
    
    let indicesValides = indices.filter(word => occurrences[word] === 1);
    
    console.log("Indices valides :", indicesValides.join(", "));
    
    let proposition = await poserQuestion("Joueur actif, quelle est votre réponse ? ");

  
    
    propositions.push({ motMystere, indices, indicesValides, proposition });
    
    fs.writeFileSync("propositions.json", JSON.stringify(propositions, null, 2));
    
    tour++;
    if (tour < motsMystere.length) {
        await jouerTour();
    } else {
        console.log("\nPartie terminée ! Consultez 'propositions.json' pour voir les propositions.");
        rl.close();
    }
}

console.log("Bienvenue dans Just One en mode texte !");
jouerTour();
