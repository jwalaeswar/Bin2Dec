document.addEventListener("DOMContentLoaded", () => {
    const binaryInput = document.getElementById("binaryInput");
    const decimalOutput = document.getElementById("decimalOutput");
    const errorMessage = document.getElementById("errorMessage");
    const formulaBox = document.getElementById("formulaBox");
    const digitCounter = document.getElementById("digitCounter");
    const modeToggle = document.getElementById("modeToggle");
    const toggleLabel = document.getElementById("toggleLabel");
    const clearBtn = document.getElementById("clearBtn");

    function processInput() {
        const rawValue = binaryInput ? binaryInput.value.trim() : "";
        const len = rawValue.length;

        // Update digit counter
        if (digitCounter) {
            digitCounter.textContent = modeToggle && modeToggle.checked
                ? `${len} bits`
                : `${len} / 8 bits`;
        }

        // Empty state handling
        if (len === 0) {
            showError(false);
            if (decimalOutput) decimalOutput.value = "";
            if (formulaBox) formulaBox.innerText = "Enter binary digits to see the decimal value and calculation.";
            return;
        }

        // Step 1: Validate input (check if anything other than 0 or 1 was entered)
        // Constraint: Do NOT use array methods (like every, filter, regex split to array)
        let hasInvalidChar = false;
        for (let i = 0; i < len; i++) {
            const code = rawValue.charCodeAt(i);
            // '0' is 48, '1' is 49
            if (code !== 48 && code !== 49) {
                hasInvalidChar = true;
                break;
            }
        }

        if (hasInvalidChar) {
            showError(true);
            if (decimalOutput) decimalOutput.value = "Invalid";
            if (formulaBox) formulaBox.innerText = "Error: Input contains non-binary characters.";
            return;
        }

        showError(false);

        // Step 2: Binary to Decimal conversion
        // Constraint 1: Arrays MAY NOT be used to contain the binary digits
        // Constraint 2: Single mathematical function used: Math.pow(2, power)
        let decimal = 0;
        let formulaStr = "";

        // Iterate digits from least significant (right) to most significant (left)
        for (let power = 0; power < len; power++) {
            // Index of character from right: (len - 1 - power)
            const digit = rawValue.charCodeAt(len - 1 - power) - 48; // Numeric 0 or 1

            // Single mathematical function to calculate the power of 2 positional weight:
            const positionalValue = Math.pow(2, power);
            const contribution = digit * positionalValue;
            decimal += contribution;

            // Construct educational formula string (using string concatenation, no arrays)
            const term = `(${digit} × 2^${power})`;
            if (power === 0) {
                formulaStr = term;
            } else {
                formulaStr = term + " + " + formulaStr;
            }
        }

        if (decimalOutput) decimalOutput.value = decimal.toString();
        if (formulaBox) formulaBox.innerText = formulaStr + ` = ${decimal}`;
    }

    function showError(visible) {
        if (!errorMessage || !binaryInput) return;
        if (visible) {
            errorMessage.classList.add("show");
            binaryInput.classList.add("input-error");
        } else {
            errorMessage.classList.remove("show");
            binaryInput.classList.remove("input-error");
        }
    }

    // Event Listeners
    if (binaryInput) {
        binaryInput.addEventListener("input", processInput);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (binaryInput) {
                binaryInput.value = "";
                binaryInput.focus();
            }
            processInput();
        });
    }

    if (modeToggle) {
        modeToggle.addEventListener("change", () => {
            if (modeToggle.checked) {
                if (binaryInput) binaryInput.removeAttribute("maxlength");
                if (toggleLabel) toggleLabel.innerHTML = "Mode: <strong>Variable length</strong>";
            } else {
                if (binaryInput) {
                    binaryInput.setAttribute("maxlength", "8");
                    if (binaryInput.value.length > 8) {
                        binaryInput.value = binaryInput.value.slice(0, 8);
                    }
                }
                if (toggleLabel) toggleLabel.innerHTML = "Mode: <strong>8-bit limit</strong>";
            }
            processInput();
        });
    }

    // Initialize
    processInput();
});