import { Request, Response, NextFunction } from 'express';
import { ExampleService } from '../services/example.service';

const service = new ExampleService();

export class ExampleController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.findAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.findById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
