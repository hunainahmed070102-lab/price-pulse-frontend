// Run this in browser console to reset categories
// Open browser console (F12) and paste this code:

const defaultCategories = ['fruit', 'vegetable', 'meat', 'grocery', 'dairy', 'tailor', 'street food', 'barber'];
localStorage.setItem('productCategories', JSON.stringify(defaultCategories));
console.log('Categories reset to:', defaultCategories);
console.log('Reloading page...');
window.location.reload();
