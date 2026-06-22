export type EmployeeRole = 'junior' | 'senior' | 'lead';
export type Department = 'backend' | 'frontend' | 'fullstack' | 'devops' | 'qa';

export type Employee = {
    id: number;
    name: string;
    role: EmployeeRole;
    department: Department;
    salary: number;
    skills?: string[];
}