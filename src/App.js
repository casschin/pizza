import "./normalize.css";
import "./App.css";

import React, { Component } from "react";
import classNames from "classnames";
import store from "store";

const DOUGH = {
  Neapolitan: {
    flour: 1,
    sugar: 0.0,
    salt: 0.02,
    yeast: 0.015,
    "olive oil": 0.0,
    water: 0.65
  },
  "New York": {
    flour: 1,
    sugar: 0.02,
    salt: 0.015,
    yeast: 0.015,
    "olive oil": 0.05,
    water: 0.67
  },
  Sicilian: {
    flour: 1,
    sugar: 0,
    salt: 0.02,
    yeast: 0.015,
    "olive oil": 0.03,
    water: 0.7
  }
};

class App extends Component {
  state = {
    recipe: "Neapolitan",
    flourAmount: 500
  };

  componentDidMount() {
    const newState = {};
    if (store.get("flourAmount")) {
      newState.flourAmount = store.get("flourAmount");
    }
    if (store.get("pizzaRecipe")) {
      newState.recipe = store.get("pizzaRecipe");
    }
    this.setState(newState);
  }

  ingredients() {
    const { recipe, flourAmount } = this.state;
    const ingredients = DOUGH[recipe];
    if (!ingredients) return null;
    return Object.keys(ingredients).map(ingredient => {
      if (ingredient === "flour") return null;
      return (
        <li key={`${ingredient}-ingredient`} className="Pizza-ingredient">
          <span className="Pizza-ingredientLabel">{ingredient}:</span>{" "}
          <span className="Pizza-ingredientAmount">
            {Math.round(ingredients[ingredient] * flourAmount * 10) / 10} g
          </span>
        </li>
      );
    });
  }

  setRecipe(recipe) {
    this.setState({ recipe });
    store.set("pizzaRecipe", recipe);
  }

  updateMeasurements = e => {
    e.preventDefault();
    const value = ~~e.target.value;
    const newAmount = value === 0 ? "" : value;
    this.setState({ flourAmount: newAmount });
    store.set("flourAmount", newAmount);
  };

  recipeSelector() {
    const { recipe } = this.state;
    const recipes = Object.keys(DOUGH);
    return recipes.map(key => {
      return (
        <span
          key={`${key}-recipe-option`}
          onClick={() => this.setRecipe(key)}
          className={classNames("Pizza-recipeSelection", {
            active: recipe === key
          })}
        >
          {key}
        </span>
      );
    });
  }

  render() {
    const { flourAmount } = this.state;
    return (
      <div className="Pizza">
        <header className="Pizza-header">
          <h1 className="Pizza-headerText">Pizza Dough Ratios</h1>
        </header>
        <div className="Pizza-recipeSelector">{this.recipeSelector()}</div>
        <ul className="Pizza-ingredients">
          <li className="Pizza-ingredient">
            <span className="Pizza-ingredientLabel">Flour:</span>
            <span className="Pizza-ingredientAmount">
              <input
                className="Pizza-ingredientInput"
                type="number"
                pattern="\d*"
                onChange={this.updateMeasurements}
                value={flourAmount}
              />{" "}
              g
            </span>
          </li>
          {this.ingredients()}
        </ul>
        <div className="Pizza-about">
          <p>
            <span role="img" aria-label="Pizza Emoji">
              🍕
            </span>
          </p>
          Check{" "}
          <a
            href="https://slice.seriouseats.com/2012/07/the-pizza-lab-three-doughs-to-know.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Serious Eats
          </a>{" "}
          for the full recipe details
        </div>
      </div>
    );
  }
}

export default App;
