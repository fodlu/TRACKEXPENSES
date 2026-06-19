import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome, getIncomeOverview, updateIncome } from '../controllers/incomeController.js';

const incomeRouter = express.Router();

incomeRouter.post('/add', authMiddleware, addIncome)
incomeRouter.get('/get', authMiddleware, getAllIncome)

incomeRouter.get('/overview', authMiddleware, getIncomeOverview)
incomeRouter.get('/downloadexcel', authMiddleware, downloadIncomeExcel)

incomeRouter.delete('/delete/:id', authMiddleware, deleteIncome)
incomeRouter.put('/update/:id', authMiddleware, updateIncome)

export default incomeRouter;
