export default class CardRoll {
  constructor(rollId) {
    this.rollId = rollId

    this.selectedContainer = document.getElementById('selected-container');
    this.pianoRollContainer = document.getElementById('pianoRollContainer');
    this.cursorLine = document.getElementById('cursor-line');
  }

  preparePianoRollCard() {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${this.rollId}`;
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

        this.movingCursor();
        this.selectPartOfRoll();
      });
    });
  }

  movingCursor() {
    const svg = this.selectedContainer.querySelector('svg');

    svg.addEventListener('mousemove', this.showCursor);
    svg.removeEventListener('mouseleave', this.showCursor);

    svg.addEventListener('mouseleave', this.hideCursor);
    svg.removeEventListener('mousemove', this.hideCursor);
  }

  selectPartOfRoll() {
    const svg = this.selectedContainer.querySelector('svg');
    const selectionArea = document.getElementById('selection-area');
    let isSelecting = false;
    let selectionStart = null;
    let pointLeft = 0;
    let pointRight = 0;

    svg.addEventListener('click', function(e) {
      if (!isSelecting) {
        // Start selecting
        isSelecting = true;
        selectionStart = e.clientX;
        pointLeft = selectionStart
        const rect = svg.getBoundingClientRect();
        selectionArea.style.top = rect.top + 'px';
        selectionArea.style.height = rect.height + 'px';
        selectionArea.style.left = selectionStart + 'px';
        selectionArea.style.width = '0px';
        selectionArea.style.display = 'block';
      } else {
        // Stop selecting
        isSelecting = false;
        selectionStart = null;
        console.log('selected: ', pointLeft, pointRight)
      }
    });

    svg.addEventListener('mousemove', function(e) {
      if (isSelecting && selectionStart !== null) {
        const currentX = e.clientX;
        const width = currentX - selectionStart;
        pointRight = pointLeft + width
        selectionArea.style.width = Math.abs(width) + 'px';
        selectionArea.style.left = (width > 0 ? selectionStart : currentX) + 'px';
      }
    });
  }

  showCursor = (e) => {
    const svg = this.selectedContainer.querySelector('svg');
    let isAnimating = false;

    if (!isAnimating) {
      requestAnimationFrame(() => {
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        this.cursorLine.style.top = rect.top + 'px';
        this.cursorLine.style.height = rect.height + 'px';
        this.cursorLine.style.left = x + rect.left + 'px';
        this.cursorLine.style.display = 'block';
        isAnimating = false;
      });
      isAnimating = true;
    }
  }

  hideCursor = () => {
    this.cursorLine.style.display = 'none';
  }
}