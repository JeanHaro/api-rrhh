import express from 'express';
import cors from 'cors';

// Rutas
import employeesRouter from './routes/employees.routes';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use('/employees', employeesRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'RRHH API activa'
    });
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});