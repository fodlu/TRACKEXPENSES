import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense, getExpenseOverview, updateExpense } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.post('/add', authMiddleware, addExpense)
expenseRouter.get('/get', authMiddleware, getAllExpense)

expenseRouter.get('/overview', authMiddleware, getExpenseOverview)
expenseRouter.get('/downloadexcel', authMiddleware, downloadExpenseExcel)

expenseRouter.delete('/delete/:id', authMiddleware, deleteExpense)
expenseRouter.put('/update/:id', authMiddleware, updateExpense)

export default expenseRouter