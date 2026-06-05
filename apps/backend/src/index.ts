import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  listLabs,
  getLabDetail,
  startLab,
  stopLab,
  resetLab,
  validateLab,
  completeManualLab,
  getProgress,
  getPlatformStatus,
} from '@mikrotik-labs/lab-runner';

const app = Fastify({ logger: true });

const PORT = Number(process.env.PORT ?? 43181);
const HOST = process.env.HOST ?? '127.0.0.1';

async function main() {
  await app.register(cors, { origin: true });

  app.get('/api/labs', async (_request, reply) => {
    try {
      const labs = await listLabs();
      return reply.send(labs);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.get('/api/labs/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const detail = await getLabDetail(id);
      if (!detail) {
        return reply.status(404).send({ message: `Lab "${id}" not found.` });
      }
      return reply.send(detail);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/labs/:id/start', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await startLab(id);
      if (!result.success) {
        return reply.status(result.activeLab ? 409 : 400).send(result);
      }
      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/labs/:id/stop', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = (request.body ?? {}) as { destroy?: boolean };
      const result = await stopLab(id, { destroy: body.destroy });
      if (!result.success) {
        return reply.status(400).send({ message: result.message });
      }
      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/labs/:id/reset', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await resetLab(id);
      if (!result.success) {
        return reply.status(result.activeLab ? 409 : 400).send(result);
      }
      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/labs/:id/validate', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await validateLab(id);
      if (!result.success) {
        return reply.status(400).send({ message: result.message, details: result.details });
      }
      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/labs/:id/complete-manual', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await completeManualLab(id);
      if (!result.success) {
        return reply.status(400).send({ message: result.message });
      }
      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.get('/api/progress', async (_request, reply) => {
    try {
      const progress = await getProgress();
      return reply.send(progress);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.get('/api/platform/status', async (_request, reply) => {
    try {
      const status = await getPlatformStatus();
      return reply.send(status);
    } catch (err) {
      return reply.status(500).send({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
