
const logoutBtn = document.getElementById("logout-btn");
const dashboardMessage = document.getElementById("dashboard-message");

function goBack(){
  window.history.back();
}
function logout() {
  AuthApi.clearToken();
  window.location.replace("./index.html");
}

logoutBtn.addEventListener("click", logout);

async function loadDashboard() {
  const token = AuthApi.getToken();

  if (!token) {
    logout();
    return;
  }

  try {
    const data = await AuthApi.getMe(token);

    const { name, email } = data.user;

    document.getElementById("welcome-title").textContent =
      `Welcome back, ${name}!`;

    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-email").textContent = email;
    document.getElementById("detail-name").textContent = name;
    document.getElementById("detail-email").textContent = email;

    document.getElementById("avatar").textContent =
      name.charAt(0).toUpperCase();
  } catch (error) {
    AuthApi.clearToken();

    dashboardMessage.textContent = error.message.includes("connect to the server")
      ? error.message
      : "Your session has expired. Please sign in again.";

    dashboardMessage.className = "message error";

    setTimeout(() => {
      window.location.replace("./index.html");
    }, 1500);
  }
}

loadDashboard();
