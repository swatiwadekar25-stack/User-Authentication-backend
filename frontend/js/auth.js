
const authForm = document.getElementById("auth-form");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");
const submitBtn = document.getElementById("submit-btn");
const message = document.getElementById("form-message");
const bottomSwitch = document.getElementById("bottom-switch");

let mode = "login";

function setMessage(text = "", type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function setMode(nextMode) {
  mode = nextMode;
  const isRegister = mode === "register";

  nameField.hidden = !isRegister;
  nameInput.required = isRegister;
  passwordHint.hidden = !isRegister;

  passwordInput.autocomplete = isRegister
    ? "new-password"
    : "current-password";

  loginTab.classList.toggle("active", !isRegister);
  registerTab.classList.toggle("active", isRegister);

  loginTab.setAttribute("aria-pressed", String(!isRegister));
  registerTab.setAttribute("aria-pressed", String(isRegister));

  document.getElementById("form-eyebrow").textContent =
    isRegister ? "GET STARTED TODAY" : "WELCOME BACK";

  document.getElementById("form-title").textContent =
    isRegister ? "Create your account" : "Sign in to your account";

  document.getElementById("form-description").textContent =
    isRegister
      ? "Fill in your details to get started."
      : "Enter your details to continue.";

  document.getElementById("form-options").hidden = isRegister;

  submitBtn.innerHTML = isRegister
    ? 'Create Account <span aria-hidden="true">→</span>'
    : 'Sign In <span aria-hidden="true">→</span>';

  document.getElementById("form-bottom").firstChild.textContent =
    isRegister ? "Already have an account? " : "New here? ";

  bottomSwitch.textContent = isRegister
    ? "Sign in"
    : "Create an account";

  setMessage();
}

loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));

bottomSwitch.addEventListener("click", () => {
  setMode(mode === "login" ? "register" : "login");
});

document.getElementById("password-toggle").addEventListener("click", (event) => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  event.currentTarget.textContent = show ? "Hide" : "Show";
  event.currentTarget.setAttribute(
    "aria-label",
    show ? "Hide password" : "Show password"
  );
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage();

  if (!authForm.reportValidity()) return;

  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  if (mode === "register") {
    payload.name = nameInput.value.trim();
  }

  submitBtn.disabled = true;
  submitBtn.textContent = mode === "login"
    ? "Signing in..."
    : "Creating account...";

  try {
    const data = mode === "login"
      ? await AuthApi.login(payload)
      : await AuthApi.register(payload);

    AuthApi.saveToken(
      data.token,
      mode === "login" && document.getElementById("remember").checked
    );

    window.location.href = "./dashboard.html";
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    submitBtn.disabled = false;

    if (submitBtn.isConnected) {
      submitBtn.innerHTML = mode === "login"
        ? 'Sign In <span aria-hidden="true">→</span>'
        : 'Create Account <span aria-hidden="true">→</span>';
    }
  }
});

setMode("login");
