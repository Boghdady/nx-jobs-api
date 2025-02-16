import { Job } from '../../decorators/job.decorator';

@Job({
  name: 'fibonacci',
  description: 'Generates a fibonacci sequence and store it in DB',
})
export class FibonacciJob {}
