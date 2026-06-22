import { Request, Response } from 'express';

// Tipados
import { Department, Employee, EmployeeRole } from '../../types';

// Utils
import { 
    createEmployee,
    deleteEmployee,
    findAll, 
    findByDepartment, 
    findById, 
    findByRole, 
    getDepartmentCost, 
    getEmployeeSummary,
    updateEmployee
} from '../../utils/employee.utils';

const validRoles: EmployeeRole[] = ['junior', 'senior', 'lead'];
const validDepts: Department[] = ['backend', 'frontend', 'fullstack', 'devops', 'qa'];

// GET /employees
export const getAllEmployees = ( req: Request, res: Response ): void => {
    res.json(findAll());
}

// GET /employees/role/:role
export const getEmployeesByRole = ( req: Request, res: Response ): void => {
    const role = req.params.role as EmployeeRole;

    if ( !validRoles.includes(role) ) {
        res.status(400).json({
            error: `Rol inválido. Opciones: ${validRoles.join(', ')}`
        });

        return;
    }

    res.json(findByRole(role));
}

// GET /employees/department/:department
export const getEmployeesByDepartment = ( req: Request, res: Response ): void => {
    const department = req.params.department as Department;

    if ( !validDepts.includes(department) ) {
        res.status(400).json({
            error: `Departamento inválido. Opciones: ${validDepts.join(', ')}`
        });

        return;
    }

    res.json(findByDepartment(department));
}

// GET /employees/department/:department/report
export const getDepartmentReport = ( req: Request, res: Response ): void => {
    const department = req.params.department as Department;

    if ( !validDepts.includes(department) ) {
        res.status(400).json({
            error: `Departamento inválido. Opciones: ${validDepts.join(', ')}`
        });

        return;
    }

    const employees = findByDepartment(department);
    const cost = getDepartmentCost(department);

    res.json({
        department,
        totalEmployees: employees.length,
        totalSalaryCost: cost,
        employees: employees.map( employee => getEmployeeSummary(employee) )
    });
}

// GET /employees/:id
export const getEmployeeById = ( req: Request, res: Response ): void => {
    const id = Number(req.params.id);
    const employee = findById(id);

    if ( !employee ) {
        res.status(404).json({
            error: `Empleado con id ${id} no encontrado`
        });

        return;
    }

    res.json(employee);
}

// POST /employees
export const createNewEmployee = ( req: Request, res: Response ): void => {
    const { name, role, department, salary, skills } = req.body;

    if ( !name || !role || !department || !salary ) {
        res.status(400).json({
            error: 'Campos obligatorios: name, role, department, salary'
        });

        return;
    }

    if ( !validRoles.includes(role) ) {
        res.status(400).json({
            error: `Rol inválido. Opciones: ${validRoles.join(', ')}`
        });

        return;
    }

    if ( !validDepts.includes(department) ) {
        res.status(400).json({
            error: `Departamento inválido. Opciones ${validDepts.join(', ')}`
        });

        return;
    }

    if ( isNaN(Number(salary)) || Number(salary) <= 0) {
        res.status(400).json({
            error: 'El salario debe ser un número mayor a 0'
        });

        return;
    }

    const newEmployee = createEmployee({ name, role, department, salary: Number(salary), skills });

    res.status(201).json(newEmployee);
}

// PATCH /employees/:id
export const updateExistingEmployee = ( req: Request, res: Response ): void => {
    const id = Number(req.params.id);
    const data = req.body;

    if ( data.role && !validRoles.includes(data.role) ) {
        res.status(400).json({
            error: `Rol inválido. Opciones: ${validRoles.join(', ')}`
        });

        return;
    }

    if ( data.department && !validDepts.includes(data.department) ) {
        res.status(400).json({
            error: `Departamento inválido. Opciones: ${validDepts.join(', ')}`
        });

        return;
    }

    // Solo extraes los campos que existen en Employee
    const allowedData: Partial<Omit<Employee, 'id'>> = {
        ...(data.name       && { name: data.name }),
        ...(data.role       && { role: data.role }),
        ...(data.department && { department: data.department }),
        ...(data.salary     && { salary: Number(data.salary) }),
        ...(data.skills     && { skills: data.skills }),
    }

    const updated = updateEmployee(id, allowedData);

    if ( !updated ) {
        res.status(404).json({
            error: `Empleado con id ${id} no encontrado.`
        });

        return;
    }

    res.json(updated);
}

// DELETE /employees/:id
export const deleteExistingEmployee = ( req: Request, res: Response ): void => {
    const id = Number(req.params.id);
    const deleted = deleteEmployee(id);

    if ( !deleted ) {
        res.status(404).json({
            error: `Empleado con id ${id} no encontrado`
        });

        return;
    }

    res.json({
        message: `Empleado ${id} eliminado correctamente`
    });
}