export const hideCursor = () => {
  const cursor = document.getElementById('cursor-line');
  if (cursor.style.display === 'block') {
    cursor.style.display = 'none';
  }
}