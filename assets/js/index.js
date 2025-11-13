const form = document.getElementById("generate-password-form");
const generatedPasswordInput = document.getElementById("generated-password");
const copyButton = document.getElementById("copy-button");
const copyFeedback = copyButton.querySelector(".copy-feedback");

const passwordLengthDisplayValue = document.getElementById(
  "password-length-value"
);
const passwordLengthSlider = document.getElementById("password-length-slider");

const includeUppercaseOption = document.getElementById("include-uppercase");
const includeLowercaseOption = document.getElementById("include-lowercase");
const includeNumbersOption = document.getElementById("include-numbers");
const includeSymbolsOption = document.getElementById("include-symbols");

const strengthText = document.querySelector(".strength-text");
const strengthBars = document.querySelectorAll(".strength-bar");

const CHARACTER_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const updateStrengthText = (strength) => {
  strengthText.textContent = strength;
  strengthText.classList.remove("hidden");
};

const removeStrengthBarLevelClass = (bar) => {
  bar.classList.remove("too-weak", "weak", "medium", "strong");
};

const updatePasswordLengthDisplayValue = () => {
  passwordLengthDisplayValue.textContent = passwordLengthSlider.value;
};

const updateSliderProgress = (mode = "") => {
  const min = parseInt(passwordLengthSlider.min, 10);
  const max = parseInt(passwordLengthSlider.max, 10);
  const value = parseInt(passwordLengthSlider.value, 10);

  const percentage = mode === "reset" ? 0 : ((value - min) / (max - min)) * 100;

  passwordLengthSlider.style.background = `linear-gradient(to right, var(--color-green) 0%, var(--color-green) ${percentage}%, var(--color-grey-850) ${percentage}%, var(--color-grey-850) 100%)`;
};

const updateStrengthBars = (strength) => {
  strengthBars.forEach((bar, index) => {
    removeStrengthBarLevelClass(bar);

    switch (strength) {
      case "too weak":
        if (index === 0) bar.classList.add("too-weak");
        break;
      case "weak":
        if (index < 2) bar.classList.add("weak");
        break;
      case "medium":
        if (index < 3) bar.classList.add("medium");
        break;
      case "strong":
        if (index < 4) bar.classList.add("strong");
        break;
    }
  });
};

const generatePassword = (length, options) => {
  const characterPool = Object.entries(options)
    .filter(([_, value]) => value)
    .map(([key]) => CHARACTER_SETS[key])
    .join("");

  if (characterPool.length === 0) return "";

  return Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    return characterPool[randomIndex];
  }).join("");
};

const calculatePasswordStrength = (length) => {
  switch (true) {
    case length < 6:
      return "too weak";
    case length < 10:
      return "weak";
    case length < 13:
      return "medium";
    default:
      return "strong";
  }
};

const copyToClipboard = async () => {
  const password = generatedPasswordInput.value;

  if (!password) return;

  try {
    await navigator.clipboard.writeText(generatedPasswordInput.value);

    copyFeedback.classList.remove("hidden");

    setTimeout(() => {
      copyFeedback.classList.add("hidden");
    }, 2000);
  } catch (error) {
    console.error("Failed to copy text: ", error);
  }
};

const clearStyles = () => {
  if (passwordLengthSlider.value === 0) updateSliderProgress("reset");

  updateStrengthText("");

  strengthBars.forEach((bar) => {
    if (bar.classList.length > 1) removeStrengthBarLevelClass(bar);
  });

  generatedPasswordInput.value = "";
};

const updateForm = (event) => {
  event.preventDefault();

  const passwordLength = parseInt(passwordLengthSlider.value, 10);
  const hasOptionsChecked =
    includeUppercaseOption.checked ||
    includeLowercaseOption.checked ||
    includeNumbersOption.checked ||
    includeSymbolsOption.checked;

  if (passwordLength === 0 || !hasOptionsChecked) {
    clearStyles();
    return;
  }

  const options = {
    uppercase: includeUppercaseOption.checked,
    lowercase: includeLowercaseOption.checked,
    numbers: includeNumbersOption.checked,
    symbols: includeSymbolsOption.checked,
  };

  const password = generatePassword(passwordLength, options);
  const strength = calculatePasswordStrength(passwordLength);

  generatedPasswordInput.value = password;

  updateSliderProgress();
  updateStrengthText(strength);
  updateStrengthBars(strength);
};

copyButton.addEventListener("click", copyToClipboard);

passwordLengthSlider.addEventListener("input", () => {
  updatePasswordLengthDisplayValue();
  updateSliderProgress();
});

form.addEventListener("submit", updateForm);

document.addEventListener("DOMContentLoaded", () => {
  clearStyles();
  updatePasswordLengthDisplayValue();
  updateSliderProgress();
});
