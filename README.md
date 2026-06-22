# RRHH — Sistema de Gestión de Empleados

Sistema de gestión de empleados con **dos interfaces**: CLI interactiva y API REST.  
Proyecto de práctica de la **Objetos y Tipos Personalizados en TypeScript**.

---

## Estructura del proyecto

```
src/
├── types.ts                            ← Tipos del dominio (Employee, EmployeeRole, Department)
├── data/
│   ├── employees.json                  ← Base de datos en disco (persiste entre ejecuciones)
│   └── db.ts                           ← Capa de lectura/escritura al JSON
├── utils/
│   └── employee.utils.ts               ← Lógica de negocio pura (compartida entre CLI y API)
├── cli/
│   └── cli.ts                          ← Interfaz de terminal interactiva
└── api/
    ├── controllers/
    │   └── employees.controller.ts
    ├── routes/
    │   └── employees.routes.ts
    └── app.ts                          ← Servidor Express (puerto 3001)
```

---

## Cómo ejecutar

```bash
# Versión CLI
pnpm run start:cli

# Versión API
pnpm run start:api
```

> 💡 La CLI y la API comparten el mismo `employees.json`.  
> Un cambio desde la API se verá reflejado al abrir la CLI y viceversa.

API disponible en: **http://localhost:3001**

---

## Conceptos TypeScript practicados

| Concepto | Dónde se usa |
|---|---|
| `type` aliases | `types.ts` |
| Union types de string literals | `EmployeeRole`, `Department` |
| Propiedades opcionales (`?`) | `skills?` en `Employee` |
| `Omit<T, K>` | Parámetro `data` en `createEmployee` |
| `Partial<T>` | Parámetro `data` en `updateEmployee` |
| `Employee \| undefined` | Retorno de `findById`, `updateEmployee` |
| Nullish coalescing (`??`) | Fallback de `skills` en `getEmployeeSummary` |
| Spread condicional | Whitelist de campos en PATCH |
| `reduce` | Cálculo de costo salarial total |

---

## Middlewares

| Middleware | Función |
|---|---|
| `express.json()` | Parsea el body de las peticiones como JSON |
| `cors()` | Permite peticiones desde cualquier origen — habilita el consumo desde Angular u otros frontends |

---

## Modelo de datos

```typescript
type EmployeeRole = 'junior' | 'senior' | 'lead';
type Department   = 'backend' | 'frontend' | 'fullstack' | 'devops' | 'qa';

type Employee = {
    id:         number;
    name:       string;
    role:       EmployeeRole;
    department: Department;
    salary:     number;
    skills?:    string[];
}
```

---

## Endpoints — API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Estado de la API |
| GET | `/employees` | Todos los empleados |
| GET | `/employees/role/:role` | Filtrar por rol |
| GET | `/employees/department/:department` | Filtrar por departamento |
| GET | `/employees/department/:department/report` | Reporte de departamento |
| GET | `/employees/:id` | Un empleado por id |
| POST | `/employees` | Crear empleado |
| PATCH | `/employees/:id` | Actualizar empleado (parcialmente) |
| DELETE | `/employees/:id` | Eliminar empleado |

---

## Ejemplos de requests

### GET — Filtrar por rol
```
GET http://localhost:3001/employees/role/senior
```

### GET — Reporte de departamento
```
GET http://localhost:3001/employees/department/backend/report
```

### POST — Crear empleado
```
POST http://localhost:3001/employees
Content-Type: application/json

{
    "name": "Diego Sánchez",
    "role": "senior",
    "department": "backend",
    "salary": 4200,
    "skills": ["Node.js", "MongoDB"]
}
```

**Campos obligatorios:** `name`, `role`, `department`, `salary`  
**Campos opcionales:** `skills`  
**Roles válidos:** `junior` | `senior` | `lead`  
**Departamentos válidos:** `backend` | `frontend` | `fullstack` | `devops` | `qa`

### PATCH — Actualizar (solo los campos que cambien)
```
PATCH http://localhost:3001/employees/1
Content-Type: application/json

{ "salary": 5500, "role": "lead" }
```

### DELETE — Eliminar
```
DELETE http://localhost:3001/employees/3
```

---

## CLI — Opciones del menú

```
1. Ver todos los empleados
2. Buscar empleado por id
3. Filtrar por rol
4. Filtrar por departamento
5. Reporte de departamento (empleados + costo salarial)
6. Crear empleado
7. Actualizar empleado
8. Eliminar empleado
0. Salir
```

---

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| `200` | OK — operación exitosa |
| `201` | Created — empleado creado |
| `400` | Bad Request — datos inválidos |
| `404` | Not Found — empleado no encontrado |

---

## Notas técnicas

- **Persistencia real en disco** — los datos sobreviven al reinicio
- **Storage compartido** — CLI y API leen y escriben el mismo `employees.json`
- **CORS habilitado** — acepta peticiones desde cualquier origen (`cors()` sin restricciones)
- **Whitelist en PATCH** — solo campos del tipo `Employee` son actualizables
- **IDs sin colisión** — generados con `Math.max` sobre ids existentes
- **Orden de rutas** — rutas específicas van antes que `/:id`