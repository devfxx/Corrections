import { Grammarly } from '@gravitacion/grammarly-api';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { reformat } from './lib/transform';

const analyse = new Grammarly();

const correctionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required')
});

const hono = new Hono();
hono.use(cors());

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

    const grammarResults = await analyse.analyse(body.data.text);
    const correctedMessage = reformat(grammarResults);

    return c.json({
      error: false,
      message: 'Successfully corrected the text',
      corrected: correctedMessage
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
