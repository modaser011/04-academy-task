addEventListener("DOMContentLoaded", event => {
    const sepaRadio = document.getElementById("sepa");
    const cardRadio = document.getElementById("card");
    const sepaFields = document.getElementById("sepaFields");
    const cardFields = document.getElementById("cardFields");

    const sepaCardHolder = document.getElementById("sepaCardHolder");
    const sepaCardNumber = document.getElementById("sepaCardNumber");
    const visaCardHolder = document.getElementById("visaCardHolder");
    const visaCardNumber = document.getElementById("visaCardNumber");

    function handlePaymentMethodChange() {
        if (sepaRadio.checked) {
            sepaFields.style.display = "block";
            cardFields.style.display = "none";
            sepaCardHolder.required = true;
            sepaCardNumber.required = true;
            visaCardHolder.required = false;
            visaCardNumber.required = false;
        } else if (cardRadio.checked) {
            cardFields.style.display = "block";
            sepaFields.style.display = "none";
            visaCardHolder.required = true;
            visaCardNumber.required = true;
            sepaCardHolder.required = false;
            sepaCardNumber.required = false;
        }
    }

    sepaRadio.addEventListener("change", handlePaymentMethodChange);
    cardRadio.addEventListener("change", handlePaymentMethodChange);

    // handlePaymentMethodChange();

    const phoneInput1 = document.querySelector("#loginPhoneNumber");
    const phoneInput2 = document.querySelector("#contactPhoneNumber");

    const iti1 = window.intlTelInput(phoneInput1, {
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(response => response.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("US"));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    const iti2 = window.intlTelInput(phoneInput2, {
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(response => response.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("US"));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    function validateForm(event) {
        event.preventDefault();
        let isValid = true;

        const phone1 = iti1.getNumber();
        if (!iti1.isValidNumber()) {
            phoneInput1.setCustomValidity(
                "Please enter a valid phone number for the student."
            );
            phoneInput1.reportValidity();
            if (isValid) phoneInput1.focus();
            isValid = false;
        } else {
            phoneInput1.setCustomValidity("");
        }

        const phone2 = iti2.getNumber();
        if (!iti2.isValidNumber()) {
            phoneInput2.setCustomValidity(
                "Please enter a valid phone number for the parent."
            );
            phoneInput2.reportValidity();
            if (isValid) phoneInput2.focus();
            isValid = false;
        } else {
            phoneInput2.setCustomValidity("");
        }

        const emailInput = document.querySelector("#emailAddress");
        const emailValue = emailInput.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailValue)) {
            emailInput.setCustomValidity("Please enter a valid email address.");
            emailInput.reportValidity();
            if (isValid) emailInput.focus();
            isValid = false;
        } else {
            emailInput.setCustomValidity("");
        }

        if (isValid) {
            const formData = {
                loginPhoneNumber: phone1,
                contactPhoneNumber: phone2,
                emailAddress: emailValue,
                contactName: document.querySelector("#contactName").value,
                billingAddress: document.querySelector("#address").value,
                postalCode: document.querySelector("#postalCode").value,
                city: document.querySelector("#city").value,
                country: document.querySelector("#country").value,
                monthlySessions: document.querySelector("#sessions").value,
                selectedOffer: document.querySelector(
                    '.offers input[type="radio"]:checked'
                ).id,
                payInAdvance: document.querySelector(".toggle-switch input").checked,
            };

            console.log("Form Data:", formData);
        }
    }

    function setupDynamicValidation() {
        const inputs = [
            phoneInput1,
            phoneInput2,
            document.querySelector("#emailAddress"),
        ];

        inputs.forEach(input => {
            input.addEventListener("input", () => {
                input.setCustomValidity("");
                input.reportValidity();
            });
        });
    }

    setupDynamicValidation();

    const form = document.querySelector(".form");
    form.addEventListener("submit", e => validateForm(e));

    function updateSalary() {
        const sessionsSelect = document.getElementById("sessions");
        const sessionNumber = document.querySelector(".session__number");
        const offer = document.querySelector('.offers input[type="radio"]:checked');
        const payAdvance = document.querySelector(".toggle-switch input");
        let actualPrice = document.querySelector(".actual__price");
        let discountPercentage = document.querySelector(".discout p");
        let discountamount = document.querySelector(".discout .discount__amount");
        let totlaPrice = document.querySelector(".total__price__amount");
        sessionNumber.innerText = sessionsSelect.value;
        let discount = +offer.getAttribute("data-discount");
        if (payAdvance.checked === true) {
            discount += +payAdvance.getAttribute("data-discount");
        }
        discountPercentage.innerText = `discount ${discount}%`;
        discountamount.innerText = `${parseFloat(
      +sessionsSelect.value * 29.6 * discount * 0.01
    ).toFixed(2)}$`;
        actualPrice.innerText = `${parseFloat(
      29.6 - parseFloat(29.6 * discount * 0.01)
    ).toFixed(2)}$`;
        totlaPrice.innerText = `${parseFloat(
      (29.6 - parseFloat(29.6 * discount * 0.01).toFixed(2)) *
        +sessionsSelect.value
    ).toFixed(2)}$`;
    }

    updateSalary();
    const sessionsSelect = document.getElementById("sessions");
    const offers = document.querySelectorAll(".offers input");
    const payAdvance = document.querySelector(".toggle-switch input");
    sessionsSelect.addEventListener("change", updateSalary);

    offers.forEach(offer => {
        offer.addEventListener("change", updateSalary);
    });

    payAdvance.addEventListener("change", updateSalary);
});