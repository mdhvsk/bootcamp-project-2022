import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from "react-router-dom";
import recipeData from "../recipeData.json"



interface Recipe {
    name: string;
    image: string;
    description: string;
    ingredients: string[];
    instructions: string[];
}

interface RecipePageProps {
    external?: boolean;
}

RecipePage.defaultProps = {

}

function RecipePage(props: RecipePageProps) {
    const { name } = useParams();
    const [recipe, setRecipe] = useState<Recipe>({
        name: "",
        image: "",
        description :"",
        ingredients:  [],
        instructions: []
    });

    // useEffect(()=> {
    //     fetch("http://localhost:3001/recipe/"+name)
    //     .then((response) => response.json())
    //     .then(recipe => {
    //         setRecipe(recipe[0]);
    //         setAllIngredients(recipe[0].ingredients);
    //         setAllInstructions(recipe[0].instructions)
    //     } )
    //     .catch(err => console.log(err))
    // })
    const [newIngredient, setNewIngredient] = useState('');
    const [allIngredients, setAllIngredients] = useState<String[]>([]);
    const [newInstruction, setNewInstruction] = useState('');
    const [allInstructions, setAllInstructions] = useState<String[]>([]);

    useEffect(() => {
        if (props.external) {
            fetch("https://bootcamp-milestone-4.onrender.com/recipe/" + name)
                .then((res) => res.json())
                .then((data) => {
                    setRecipe(data[0]);
                    setAllIngredients(data[0].ingredients);
                    setAllInstructions(data[0].instructions)
                })
        } else {
            console.log("Im in")
            console.log(name)
            fetch("http://localhost:3001/recipe/" + name)
                .then((res) => res.json())
                .then((recipe) => {
                    setRecipe(recipe);
                    setAllIngredients(recipe.ingredients);
                    setAllInstructions(recipe.instructions)
                    console.log(recipe)

                })
                .catch(err => console.log(err))
        }
    }, [name, props.external]);

    console.log(recipe)

    async function addIngredient() {
        const req = await fetch(`http://localhost:3001/recipe/${name}/ingredient`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "newIngredient": newIngredient
            })
        })
        fetch(`http:localhost:3001/recipe/${name}`)
        .then(res => (res.json()))
        .then(recipe => setAllIngredients(recipe[0].ingredients))        
        console.log(allIngredients)
    }

    async function addInstruction() {
        const req = await fetch(`http://localhost:3001/recipe/${name}/instruction`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "newInstruction": newInstruction
            })
        })
        fetch(`http:localhost:3001/recipe/${name}`)
        .then(res => (res.json()))
        .then(recipe => {
            setRecipe(recipe)
            setAllInstructions(recipe.instructions)
        })
             
        console.log(allInstructions)
    }
    return (
        <div>
            <div className="recipe-body">
                <div className="recipe-left">
                    <img src={recipe.image} className="pics" />
                    <h1>{recipe.name}</h1>

                </div>

                <div className="recipe-right">

                    <h2>Ingredients</h2>
                    <ul>
                        {allIngredients.map(ingredient =>
                            <li>{ingredient}</li>)}
                    </ul>
                    <input placeholder="2 cups of spinach"
                        value={newIngredient} // add newIngredient as the input's value
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setNewIngredient(e.target.value);
                        }} />
                    <button onClick={addIngredient}>Add Ingredient</button>


                </div>
            </div>
            <div className="recipe-list">
                <h2>Instructions</h2>
                <ol>
                    {allInstructions.map(instruction =>
                        <li>{instruction}</li>)}
                </ol>
                <input placeholder="2 cups of spinach"
                    value={newInstruction} // add newIngredient as the input's value
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNewInstruction(e.target.value);
                    }} />
                <button onClick={addInstruction}>Add Instruction</button>
            </div>
        </div>
    )
}

export default RecipePage