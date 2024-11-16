import { Grammarly } from '@gravitacion/grammarly-api';
import { Hono } from 'hono';
import { z } from 'zod';
import { reformat } from './lib/transform';

const analyse = new Grammarly();

const correctionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required')
});

const hono = new Hono();

hono.post('/correct', async c => {
  try {
    const body = correctionRequestSchema.safeParse(await c.req.json());
    if (!body.success) {
      c.status(400);
      return c.json({
        error: true,
        message: 'Invalid request body'
      });
    }

    const results = await analyse.analyse(body.data.text);
    const corrected = reformat(results);

    return c.json({
      error: false,
      message: corrected
    });
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({
      error: true,
      message: 'Internal server error'
    });
  }
});

hono.all('*', c =>
  c.json({
    error: false,
    message: 'Hi there!'
  })
);

export default hono;
