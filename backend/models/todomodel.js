import mongoose from "mongoose"

const todoschema = mongoose.Schema(
    {
        name: {
            type: String,
            default: true,
        }
    },
);

export  const Todo = mongoose.model('TodoRecords', todoschema);