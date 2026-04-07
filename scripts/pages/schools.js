import { showPage } from './page-handling.js';

export async function goToSchoolsPage() {
   await showPage('showSchools', 'School');
}