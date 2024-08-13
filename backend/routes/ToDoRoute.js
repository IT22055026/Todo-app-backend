import express, {request, response} from "express";
import {Todo} from "../models/todomodel.js"

const router = express.Router();

router.post('/', async(request, response) =>{

    try {
        const { name } = request.body; 

        const newTodo = new Todo({
            name: name
        });

        const savedTodo = await newTodo.save();

        response.status(201).json(savedTodo);
    } catch (error) {
        
        response.status(500).json({ message: "Failed to create Todo item", error: error.message });
    } 
});

router.get('/', async (request, response) => {
    try {
        const todos = await Todo.find();

        response.status(200).json(todos);
    } catch (error) {
        response.status(500).json({ message: "Failed to fetch Todo items", error: error.message });
    }
});

router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params; 
        const { name } = request.body; 

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { name: name },
            { new: true, runValidators: true } 
        );

        if (!updatedTodo) {
            return response.status(404).json({ message: "Todo item not found" });
        }

        response.status(200).json(updatedTodo);
    } catch (error) {
        
        response.status(500).json({ message: "Failed to update Todo item", error: error.message });
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params; 

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return response.status(404).json({ message: "Todo item not found" });
        }

        response.status(200).json({ message: "Todo item deleted successfully" });
    } catch (error) {
        
        response.status(500).json({ message: "Failed to delete Todo item", error: error.message });
    }
});


export default router;