import PianoRoll from './pianoroll.js';
import CardRoll from "./cardroll.js";
import {hideCursor} from "./helpers.js";

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;

    this.selectedContainer = document.getElementById('selected-container');
    this.pianoRollContainer = document.getElementById('pianoRollContainer');
  }

  async loadPianoRollData() {
    try {
      const response = await fetch('https://pianoroll.ai/random_notes');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  returnGreed() {
    const pianoRolls = document.querySelectorAll('.piano-roll-card');

    this.selectedContainer.classList.remove('selected-container_onn');
    this.selectedContainer.innerHTML = '';
    this.pianoRollContainer.classList.remove('col');

    pianoRolls.forEach((roll) => {
      roll.classList.remove('hide');
    })
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;

    this.pianoRollContainer.innerHTML = '';
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);
      const cardRoll = new CardRoll(it)
      const {cardDiv, svg} = cardRoll.preparePianoRollCard()

      this.pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById('loadCSV').addEventListener('click', async () => {
  const csvToSVG = new PianoRollDisplay();
  csvToSVG.returnGreed();
  hideCursor();
  await csvToSVG.generateSVGs();
});
