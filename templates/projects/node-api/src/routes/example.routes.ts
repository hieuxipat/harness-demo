import { Router } from 'express';
import { ExampleController } from '../controllers/example.controller';

export const exampleRoutes = Router();
const controller = new ExampleController();

exampleRoutes.get('/', controller.getAll);
exampleRoutes.get('/:id', controller.getById);
exampleRoutes.post('/', controller.create);
exampleRoutes.put('/:id', controller.update);
exampleRoutes.delete('/:id', controller.delete);
