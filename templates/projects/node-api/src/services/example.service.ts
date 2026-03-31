interface Example {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Placeholder service — replace with TypeORM repository or Mongoose model
export class ExampleService {
  private examples: Example[] = [];

  async findAll(): Promise<Example[]> {
    return this.examples;
  }

  async findById(id: string): Promise<Example | undefined> {
    return this.examples.find((e) => e.id === id);
  }

  async create(data: Partial<Example>): Promise<Example> {
    const example: Example = {
      id: Date.now().toString(),
      name: data.name || '',
      description: data.description,
      createdAt: new Date(),
    };
    this.examples.push(example);
    return example;
  }

  async update(id: string, data: Partial<Example>): Promise<Example | undefined> {
    const index = this.examples.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    this.examples[index] = { ...this.examples[index], ...data };
    return this.examples[index];
  }

  async remove(id: string): Promise<void> {
    this.examples = this.examples.filter((e) => e.id !== id);
  }
}
