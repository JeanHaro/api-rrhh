import { Router } from "express";
import { 
    createNewEmployee,
    deleteExistingEmployee,
    getAllEmployees, 
    getDepartmentReport, 
    getEmployeeById, 
    getEmployeesByDepartment, 
    getEmployeesByRole, 
    updateExistingEmployee
} from "../controllers/employees.controller";

const router = Router();

// GETs
router.get('/', getAllEmployees);
router.get('/role/:role', getEmployeesByRole);
router.get('/department/:department/report', getDepartmentReport);
router.get('/department/:department', getEmployeesByDepartment);
router.get('/:id', getEmployeeById);

// POST
router.post('/', createNewEmployee);

// PATCH
router.patch('/:id', updateExistingEmployee);

// DELETE
router.delete('/:id', deleteExistingEmployee);

export default router;
