import * as readline from 'readline';

// Utils
import { 
    createEmployee, 
    updateEmployee,
    deleteEmployee, 
    
    findAll, 
    findByDepartment, 
    findById, 
    findByRole, 
    getDepartmentCost, 
    getEmployeeSummary, 
} from '../utils/employee.utils';

// Tipados
import { Department, Employee, EmployeeRole } from '../types';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = ( prompt: string ): Promise<string> => {
    return new Promise( resolve => rl.question(prompt, resolve));
}

// Menu principal
const showMenu = (): void => {
    console.log('\n================================');
    console.log('   SISTEMA DE RRHH — MENÚ');
    console.log('================================');
    console.log('1. Ver todos los empleados');
    console.log('2. Buscar empleado por id');
    console.log('3. Filtrar por rol');
    console.log('4. Filtrar por departamento');
    console.log('5. Reporte de departamento');
    console.log('6. Crear empleado');
    console.log('7. Actualizar empleado');
    console.log('8. Eliminar empleado');
    console.log('0. Salir');
    console.log('================================\n');
}

// ==========================
// Manejadores (Handlers)
// ==========================

// Obtener todos los empleados
const handleGetAll = (): void => {
    const employees = findAll();

    if ( employees.length === 0 ) {
        console.log('\n No hay empleados registrados.');
        return;
    }

    console.log('\nEmpleados registrados:\n');
    employees.forEach( 
        employee => 
            console.log(' •', getEmployeeSummary(employee)) 
    )
}

// Encontrar por ID
const handleFindById = async (): Promise<void> => {
    const input = await question('ID del empleado: ');
    const id = Number(input);

    if ( isNaN(id) ) {
        console.log('\nID inválido.');
        return;
    }

    const employee = findById(id);
    if ( !employee ) {
        console.log(`\n No existe empleado con id ${id}`);
        return;
    }

    console.log('\n Empleado encontrado:\n');
    console.log(' •', getEmployeeSummary(employee));
}

// Filtrar empleados por role
const handleFilterByRole = async (): Promise<void> => {
    const validRoles: EmployeeRole[] = ['junior', 'senior', 'lead'];
    console.log(`\n Roles disponibles: ${validRoles.join(', ')}`);

    const input = (await question('Rol: ')).toLowerCase() as EmployeeRole;

    if ( !validRoles.includes(input) ) {
        console.log('\n Rol inválido');
        return;
    }

    const employees = findByRole(input);
    if ( employees.length === 0 ) {
        console.log(`\n No hay empleados con rol ${input}`);
        return;
    }

    console.log(`\n Empleados con rol "${input}":\n`);
    employees.forEach( employee => console.log(' •', getEmployeeSummary(employee)) );
}

// Filtrar empleados por departamento
const handleFilterByDepartment = async (): Promise<void> => {
    const validDepts: Department[] = ['backend', 'frontend', 'fullstack', 'devops', 'qa'];
    console.log(`\n Departamentos: ${validDepts.join(', ')}`);

    const input = (await question('Departamento: ')).toLowerCase() as Department;

    if ( !validDepts.includes(input) ) {
        console.log('\n Departamento inválido.');
        return;
    }

    const employees = findByDepartment(input);
    if ( employees.length === 0 ) {
        console.log(`\n No hay empleados en ${input}`);
        return;
    }

    console.log(`\n Empleados en ${input}:`);
    employees.forEach( employee => console.log(' •', getEmployeeSummary(employee)) );
}

// Reporte salarial
const handleDepartmentReport = async (): Promise<void> => {
    const validDepts: Department[] = ['backend', 'frontend', 'fullstack', 'devops', 'qa'];
    console.log(`\n Departamentos: ${validDepts.join(', ')}`);

    const input = (await question('Departamento: ')).toLowerCase() as Department;

    if ( !validDepts.includes(input) ) {
        console.log('\n Departamento inválido.');
        return;
    }

    const employees = findByDepartment(input);
    const cost = getDepartmentCost(input);

    console.log(`\n Reporte - ${input.toUpperCase()}`);
    console.log(` Total empleados: ${employees.length}`);
    console.log(` Costo salarial: $${cost} `);
    console.log(' Equipo:\n');
    employees.forEach( employee => console.log(' •', getEmployeeSummary(employee)) );
}

// Crear empleado
const handleCreate = async (): Promise<void> => {
    const validRoles: EmployeeRole[] = ['junior', 'senior', 'lead'];
    const validDepts: Department[] = ['backend', 'frontend', 'fullstack', 'devops', 'qa'];

    console.log('\n── Crear nuevo empleado ──');
    const name = await question('Nombre: ');
    const role = (await question(`Rol (${validRoles.join(' | ')}): `)).toLowerCase() as EmployeeRole;
    const department = (await question(`Departamento (${validDepts.join(' | ')}): `)).toLowerCase() as Department;
    const salaryRaw = await question('Salario: ');
    const skillsRaw = await question('Skills (separadas por coma, o Enter para omitir): ');

    if ( !validRoles.includes(role) ) {
        console.log('\n Rol inválido.');
        return;
    }

    if ( !validDepts.includes(department) ) {
        console.log('\n Departamento inválido.');
        return;
    }

    const salary = Number(salaryRaw);
    if ( isNaN(salary) || salary <= 0 ) {
        console.log('\n Salario inválido.');
        return;
    }

    const skills = skillsRaw.trim()
                            ? skillsRaw
                                    .split(',')
                                    .map( skill => skill.trim() )
                                    .filter( skill => skill.length > 0 )
                            : undefined;

    const newEmployee: Employee = createEmployee({
        name,
        role,
        department,
        salary,
        skills
    });
    console.log('\n Empleado creado:\n');
    console.log(' •', getEmployeeSummary(newEmployee));
}

// Actualizar empleado
const handleUpdate = async (): Promise<void> => {
    const input = await question('ID del empleado a actualizar: ');
    const id = Number(input);

    if ( isNaN(id) ) {
        console.log('\n ID inválido.');
        return;
    }

    const employee = findById(id);
    if ( !employee ) {
        console.log(`\n No existe empleado con id ${id}.`);
        return;
    }

    console.log('\n Deja en blanco los campos que no quieras cambiar. \n');

    const name = await question(`Nombre (${employee.name}): `);
    const salaryRaw = await question(`Salario (${employee.salary}): `);
    const skillsRaw = await question(`Skills (${employee.skills?.join(', ') ?? 'ninguna'}): `);

    const updated = updateEmployee(id, {
        ...(name.trim() && { name: name.trim() }),
        ...(salaryRaw.trim() && { salary: Number(salaryRaw) }),
        ...(skillsRaw.trim() && { skills: skillsRaw.split(',').map( skill => skill.trim() ) })
    });

    console.log('\n Empleado actualizado: \n');
    // ! - para que confie TS diciendo que habrá valor
    console.log(' •', getEmployeeSummary(updated!));
}

// Eliminar empleado
const handleDelete = async (): Promise<void> => {
    const input = await question('ID del empleado a eliminar: ');
    const id = Number(input);

    if ( isNaN(id) ) {
        console.log('\n ID inválido.');
        return;
    }

    const confirm = await question(`¿Seguro que quieres eliminar al empleado ${id}? (s/n): `);
    if ( confirm.toLowerCase() !== 's' ) {
        console.log('\n Operación cancelada');
        return;
    }

    const deleted = deleteEmployee(id);
    if ( !deleted ) {
        console.log(`\n No existe empleado con id ${id}.`);
        return;
    }

    console.log(`\n Empleado ${id} eliminado correctamente.`);
}

// ==========================
// LOOP 
// ==========================

const main = async (): Promise<void> => {
    console.log('\n Bienvenido al Sistema de RRHH');

    while (true) {
        showMenu();

        const option = await question('Selecciona una opción: ');

        switch (option.trim()) {
            case '1': 
                handleGetAll();
                break;
            case '2':
                await handleFindById();
                break;
            case '3':
                await handleFilterByRole();
                break;
            case '4':
                await handleFilterByDepartment();
                break;
            case '5':
                await handleDepartmentReport();
                break;
            case '6':
                await handleCreate();
                break;
            case '7':
                await  handleUpdate();
                break;
            case '8':
                await handleDelete();
                break;
            case '0':
                console.log('\n Hasta luego \n');
                rl.close();
                process.exit(0); // Cierra el proceso limpiamente. 0 - indica salida sin errores, si fuera 1 indicaría error
            default: 
                console.log('\n Opción no válida.');
        }
    }
}

main();
