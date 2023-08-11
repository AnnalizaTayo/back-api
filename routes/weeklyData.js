const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URL
const mongoUrl = 'mongodb://localhost:27017/your-database-name';

// Function to fetch the data you want
async function fetchWeeklyData() {
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('your-collection-name');

    // Calculate the start and end dates for the week
    const now = new Date();
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfWeek = new Date(endOfWeek);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Query to aggregate daily session and view counts for the week
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lt: endOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          totalSessions: { $sum: 1 },
          totalViews: { $sum: '$pageViews' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    // Transform the data to match your desired format
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const visitsChartData = [];
    const viewsChartData = [];

    result.forEach((item) => {
      visitsChartData.push({ name: daysOfWeek[item._id - 1], visits: item.totalSessions });
      viewsChartData.push({ name: daysOfWeek[item._id - 1], views: item.totalViews });
    });

    return {
      Visits: {
        color: '#8884d8',
        icon: '/userIcon.svg',
        title: 'Total Visits',
        number: result.reduce((acc, item) => acc + item.totalSessions, 0).toFixed(2),
        dataKey: 'visits',
        percentage: 45,
        chartData: visitsChartData
      },
      Views: {
        color: '#8884d8',
        icon: '/eyeIcon.svg',
        title: 'Total Views',
        number: result.reduce((acc, item) => acc + item.totalViews, 0).toFixed(2),
        dataKey: 'views',
        percentage: 45,
        chartData: viewsChartData
      }
    };
  } finally {
    await client.close();
  }
}

// Define the route to fetch and return the data
router.get('/weekly-data', async (req, res) => {
  try {
    const weeklyData = await fetchWeeklyData();
    res.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
