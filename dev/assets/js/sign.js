document.getElementById('signInForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('username').value.trim();
  if (!name) return alert('Please enter your name');
  localStorage.setItem('username', name);
  redirectTo('/app');
});
