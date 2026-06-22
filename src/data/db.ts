import fs from 'fs';
import path from 'path';
import { Employee } from '../types';

const DB_PATH = path.join(__dirname, 'employees.json');

// Leer todos los empleados del disco
export const getEmployees = (): Employee[] => {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');

    // JSON.parse retorna any[] porque TS no puede saber que forma tiene un JSON, asi que con as Employee[] le dices que confie en ti que es un array de empleados
    return JSON.parse(raw) as Employee[];
}

// Guardar el array completo al disco
export const saveEmployees = ( employees: Employee[] ): void => {
    fs.writeFileSync(
        DB_PATH, 
        JSON.stringify(employees, null, 2), 
        'utf-8'
    );
}