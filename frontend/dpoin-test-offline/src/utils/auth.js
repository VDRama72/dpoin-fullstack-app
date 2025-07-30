// src/utils/auth.js
export function logout() {
  const role = localStorage.getItem('role');

  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');

  // ✅ Tambahkan penanda logout
  localStorage.setItem('isLoggedOut', 'true');

  window.dispatchEvent(new Event('storage'));

  // Tetap redirect ke homepage (etalase)
  window.location.href = '/';
}
