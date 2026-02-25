// Run this in browser console to remove transport category from localStorage
// Open browser console (F12) and paste this code:

// Clean up productCategories in localStorage
const savedCategories = localStorage.getItem('productCategories');
if (savedCategories) {
  try {
    const parsed = JSON.parse(savedCategories);
    const filtered = parsed.filter(cat => cat.toLowerCase() !== 'transport');
    localStorage.setItem('productCategories', JSON.stringify(filtered));
    console.log('Removed transport category from localStorage');
    console.log('Updated categories:', filtered);
  } catch (error) {
    console.error('Error:', error);
  }
} else {
  console.log('No saved categories found');
}

// Reload the page to see changes
window.location.reload();
