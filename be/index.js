import express from 'express';
import axios from 'axios';
import cors from 'cors';

const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
const app = express();
app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/quiz', async (req, res) => {
  try {
    const data = await fetchData('https://api.jsonserve.com/Uw5CrX');
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching quiz data');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});