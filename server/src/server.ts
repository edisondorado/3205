import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const data = [
  { email: 'jim@gmail.com', number: '221122' },
  { email: 'jam@gmail.com', number: '830347' },
  { email: 'john@gmail.com', number: '221122' },
  { email: 'jams@gmail.com', number: '349425' },
  { email: 'jams@gmail.com', number: '141424' },
  { email: 'jill@gmail.com', number: '822287' },
  { email: 'jill@gmail.com', number: '822286' }
];

let currentTimeout: NodeJS.Timeout | null = null;

app.post('/search', (req: Request, res: Response) => {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }

  const { email, number } = req.body;

  currentTimeout = setTimeout(() => {
    const result = data.filter((entry) => {
      const emailMatch = entry.email === email;
      const numberMatch = number ? entry.number === number : true;
      return emailMatch && numberMatch;
    });

    res.json(result);
  }, 5000);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
