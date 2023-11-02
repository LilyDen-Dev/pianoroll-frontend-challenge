import PianoRoll from './pianoroll.js';

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

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('piano-roll-svg');
    svg.setAttribute('width', '80%');
    svg.setAttribute('height', '150');

    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    this.selectPianoRoll();

    return { cardDiv, svg }
  }

  selectPianoRoll() {
    const pianoRolls = document.querySelectorAll('.piano-roll-card');

    pianoRolls.forEach((roll) => {
      roll.addEventListener('click', (event) => {
        const children = event.target.closest('.piano-roll-card');

        pianoRolls.forEach(el => el.classList.remove('hide'));

        this.selectedContainer.classList.add('selected-container_onn');
        this.selectedContainer.innerHTML = '';
        this.selectedContainer.appendChild(children.cloneNode(true));
        this.pianoRollContainer.classList.add('col');
        event.target.classList.add('hide');
      });
    });
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

      const { cardDiv, svg } = this.preparePianoRollCard(it)

      this.pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById('loadCSV').addEventListener('click', async () => {
  const csvToSVG = new PianoRollDisplay();
  csvToSVG.returnGreed()
  await csvToSVG.generateSVGs();
});
