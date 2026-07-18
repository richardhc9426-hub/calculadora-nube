const display = document.getElementById("display");
const message = document.getElementById("message");
const keys = document.querySelector(".calculator__keys");

let expression = "";
let calculated = false;

const operatorCharacters = ["+", "-", "*", "/", "%"];

function updateDisplay(value) {
  display.textContent = value || "0";
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#b42318" : "";
}

function appendValue(value) {
  if (calculated && !operatorCharacters.includes(value)) {
    expression = "";
  }
  calculated = false;

  const lastCharacter = expression.slice(-1);

  if (operatorCharacters.includes(value)) {
    if (!expression && value !== "-") {
      return;
    }

    if (operatorCharacters.includes(lastCharacter)) {
      expression = expression.slice(0, -1);
    }
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/%]/).pop();
    if (currentNumber.includes(".")) {
      return;
    }
    if (!currentNumber) {
      expression += "0";
    }
  }

  expression += value;
  updateDisplay(expression.replaceAll("*", "×").replaceAll("/", "÷"));
  showMessage("Operación en curso.");
}

function calculate() {
  if (!expression) {
    return;
  }

  try {
    if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
      throw new Error("Expresión no válida");
    }

    const result = Function(`"use strict"; return (${expression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Resultado no válido");
    }

    const roundedResult = Number.isInteger(result)
      ? result
      : Number(result.toFixed(8));

    expression = String(roundedResult);
    updateDisplay(expression);
    calculated = true;
    showMessage("Cálculo realizado correctamente.");
  } catch (error) {
    updateDisplay("Error");
    expression = "";
    calculated = false;
    showMessage("No fue posible realizar la operación.", true);
  }
}

function clearCalculator() {
  expression = "";
  calculated = false;
  updateDisplay("0");
  showMessage("Calculadora reiniciada.");
}

function deleteLastCharacter() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
  showMessage(expression ? "Se eliminó el último carácter." : "Ingrese una operación.");
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { value, action } = button.dataset;

  if (value !== undefined) {
    appendValue(value);
  } else if (action === "calculate") {
    calculate();
  } else if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteLastCharacter();
  }
});

document.addEventListener("keydown", (event) => {
  const allowedKeys = "0123456789+-*/%.";
  if (allowedKeys.includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLastCharacter();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});
