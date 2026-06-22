// DB
import { getEmployees, saveEmployees } from "../data/db";

// Tipados
import { 
    Department,
    Employee, 
    EmployeeRole 
} from "../types";

// ==========================
// CONSULTAS
// ==========================

// Todos los empleados
export const findAll = (): Employee[] => {
    return getEmployees();
}

// Buscar por id
export const findById = ( id: number ): Employee | undefined => {
    return getEmployees().find( employee => employee.id === id );
}

// Filtrar por rol
export const findByRole = ( role: EmployeeRole ): Employee[] => {
    return getEmployees().filter( employee => employee.role === role );
}

// Filtrar por departamento
export const findByDepartment = ( department: Department ): Employee[] => {
    return getEmployees().filter( employee => employee.department === department );
}

// Costo salarial total de un departamento
export const getDepartmentCost = ( department: Department ): number => {
    return findByDepartment(department).reduce( 
        ( total, employee) => employee.salary + total, 
        0 
    );
}

// Resumen formateado de un empleado
export const getEmployeeSummary = ( employee: Employee ): string => {
    const skills = employee.skills?.join(', ') ?? 'Sin skills registradas';

    return `[${employee.id}] ${employee.name} | ${employee.role.toUpperCase()} | ${employee.department} | $${employee.salary} | Skills: ${skills}`;
}

// ==========================
// CRUD
// ==========================

// Crear empleado
export const createEmployee = (
    data: Omit<Employee, 'id'>
): Employee => {
    const employees = getEmployees();

    const newEmployee: Employee = {
        ...data,
        id: employees.length === 0 ? 1 : Math.max(...employees.map( e => e.id )) + 1
    };

    saveEmployees([ ...employees, newEmployee ]);

    return newEmployee;
}

// Actualizar empleado
export const updateEmployee = (
    id: number,
    data: Partial<Omit<Employee, 'id'>>
): Employee | undefined => {
    const employees = getEmployees();
    const index = employees.findIndex( employee => employee.id === id );
    if ( index === -1 ) return undefined;

    // Esto es similar a Object.assign, es más moderno y está usando algo conocido como spread, acá no muta
    employees[index] = { ...employees[index], ...data };

    saveEmployees(employees);

    return employees[index];
}

// Eliminar empleado
export const deleteEmployee = ( id: number ): boolean => {
    const employees = getEmployees();
    const index = employees.findIndex( employee => employee.id === id );
    if ( index === -1 ) return false;

    employees.splice(index, 1);
    saveEmployees(employees);

    return true;
}