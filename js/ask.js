class Ask {
  maxLength = 160;
  useCounter = 0;

  constructor() {
    this.askContainer = document.querySelector(".ask");
    if (this.askContainer) {
      this.askInput = this.askContainer.querySelector(".ask__input");
      this.exampleButton = this.askContainer.querySelector(
        ".ask__button-example"
      );
      this.askButton = this.askContainer.querySelector(".ask__button-ask");
      this.resetButton = this.askContainer.querySelector(".ask__button-reset");
      this.charCounter = this.askContainer.querySelector(".ask__char-count");
      this.loading = this.askContainer.querySelector(".ask__loading");

      this.showMoreButton = document.querySelector(".showmore__button");

      this.resultsContainer = document.querySelector(".results");
      this.resultsList = this.resultsContainer.querySelector(".results__list");
    }
  }

  init() {
    if (!this.askContainer) return;
    this.askInput.addEventListener("input", (e) => this.checkInput(e));
    this.exampleButton.addEventListener("click", (e) => this.setExample(e));
    this.askButton.addEventListener("click", (e) => this.askClicked(e));
    this.resetButton.addEventListener("click", (e) => this.resetClicked(e));
    this.showMoreButton.addEventListener("click", async (e) => {
      e.preventDefault;
      await this.askClicked(e);
    });
    this.checkInput();
  }

  randomNum(floor, ceil) {
    return Math.random() * (floor - ceil) + ceil;
  }

  checkInput() {
    // check submission validity
    const charsRemaining = this.maxLength - this.askInput.value.length;
    if (charsRemaining < 0) {
      this.askButton.disabled = true;
      this.charCounter.classList.add("has-error");
    } else {
      this.askButton.disabled = false;
      this.charCounter.classList.remove("has-error");
    }
    this.charCounter.textContent = `${charsRemaining} characters remaining`;

    // check whether to display example button
    if (this.askInput.value.length === 0) {
      this.askButton.disabled = true;
      this.exampleButton.classList.remove("is-hidden");
    } else {
      this.exampleButton.classList.add("is-hidden");
    }
  }

  setExample(event) {
    event.preventDefault();
    console.log("setting example");
    this.askInput.value = "Tell me a funny joke";
    this.checkInput();
  }

  resetClicked(event) {
    event.preventDefault();
    this.askInput.value = "";
    this.checkInput();
  }

  async askClicked(event) {
    event.preventDefault();

    this.useCounter++;

    // Delete all previous results
    this.resultsList.replaceChildren();

    this.loading.classList.add("is-loading");

    let url =
      "https://ai-project.technative.dev.f90.co.uk/ai/ai-destroyer/?query=";
    let input = document.querySelector(".ask__input").value;
    input = input.trim().replaceAll(/\s+/g, "+");
    url += input;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      this.processResults(json.results, this.useCounter >= 5);
      this.loading.classList.remove("is-loading");

      console.log(document.getElementsByClassName("results__item").length);
    } catch (error) {
      console.error(error.message);
      this.loading.classList.remove("is-loading");
    }
  }

  // Takes JSON response and whether or not the API has been called 5 or more times
  processResults(data, threshold) {
    console.log(data);

    if (data.length > 0) {
      this.resultsContainer.classList.add("is-shown");
    } else {
      this.resultsContainer.classList.remove("is-shown");
    }

    for (const result of data) {
      const resultsItem = document.createElement("div");
      resultsItem.classList.add("results__item");
      this.resultsList.appendChild(resultsItem);

      const resultsItemTitle = document.createElement("h3");
      resultsItemTitle.classList.add("results__item-title");
      resultsItemTitle.textContent = result.title;
      resultsItem.appendChild(resultsItemTitle);

      const resultsItemDescription = document.createElement("p");
      resultsItemDescription.classList.add("results__item-description");
      resultsItemDescription.textContent = result.description;
      resultsItem.appendChild(resultsItemDescription);
    }

    if (threshold) {
      const dataCentreTally = document.createElement("div");
      dataCentreTally.insertAdjacentHTML(
        "beforeend",
        `<h3>Congratulations!</h3><p>Your incessant wastefulness has necessitated the construction of ${this.randomNum(2, 10).toFixed(0)} data centres!</p>`
      );
      this.resultsList.appendChild(dataCentreTally);
    }

    const treeTally = document.createElement("p");
    treeTally.textContent = `${this.randomNum(2, 20).toFixed(0)} trees burned in the making of this request!`;
    this.resultsList.appendChild(treeTally);
  }
}

// Expose an instance of the 'Ask' class
export default new Ask();
