export const hideCursor = () => {
  const cursor = document.getElementById('cursor-line');
  if (cursor.style.display === 'block') {
    cursor.style.display = 'none';
  }
}

export const removeSelected = () => {
  const selectionArea = document.getElementById('selection-area');
  if (selectionArea.style.display === 'block') {
    selectionArea.style.display = 'none';
  }
}