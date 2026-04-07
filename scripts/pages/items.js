import { showPage } from './page-handling.js';

export async function goToItemsPage() {
   await showPage('showItems', 'Item');
}