const express = require('express');
const sequelize = require('./models');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const scrapperRoutes = require('./routes/scrapperRoutes')
const cors = require('cors');

const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3001', 'http://localhost:80'] 
};


app.use(cors(corsOptions));
app.use(express.json());



app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/scrapper', scrapperRoutes);

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
