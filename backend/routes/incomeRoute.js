import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addIncome, deleteIncome, downloadIncomeExcel, getIncomeOverview, ggetAllIncome, updateIncome } from '../controllers/incomeController.js';

const incomeRouter = express.Router();

incomeRouter.post('/add', authMiddleware, addIncome)
incomeRouter.get('/get', authMiddleware, ggetAllIncome)

incomeRouter.put('/update/:id', authMiddleware, updateIncome)
incomeRouter.get('/downloadexcel', authMiddleware, downloadIncomeExcel)

incomeRouter.delete('/delete/:id', authMiddleware, deleteIncome)
incomeRouter.get('/overview', authMiddleware, getIncomeOverview)

export default incomeRouter;
