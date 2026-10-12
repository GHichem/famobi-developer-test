import cors from 'cors';
import express from 'express';

const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok'
  });
});

app.listen(PORT, () => {
  console.log(`Analytics API running at http://localhost:${PORT}`);
});