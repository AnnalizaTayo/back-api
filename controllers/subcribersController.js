const Subscribers = require('../models/Subscribers');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubs = await Subscribers.findOne({ email }).exec();

    if (existingSubs) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newSubscriber = new Subscribers({ email });

    await newSubscriber.save(); 

    return res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error in subscribe', error);
    return res.status(500).json({ message: 'Internal server error' }); 
  }
};

// Fetch all subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
      const allSubscribers = await Subscribers.find();
      res.json(allSubscribers);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};

 /* try {
      const totalSubscribers = await Subscribers.countDocuments();
      res.json({ totalSubscribers });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  } */

// Count total subscribers
exports.getTotalSubscribers = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const subscriberData = await Subscribers.find({
        subscriptionDate: { $gte: weekAgo, $lte: today },
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dailySubsData = daysOfWeek.map(day => {
        const subsOnDay = subscriberData.filter(sub => sub.subscriptionDate.getDay() === daysOfWeek.indexOf(day));
        return { name: day, subs: subsOnDay.length };
    });

    const totalWeeklySubs = subscriberData.length;

    const chartData = dailySubsData;

    res.status(200).json({ chartData, totalWeeklySubs });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
  }
  
};


// Get the 10 latest subscribers
exports.getLatestSubscribers = async (req, res) => {
  try {
      const latestSubscribers = await Subscribers.find()
          .sort({ subscriptionDate: -1 })
          .limit(10);
      res.json(latestSubscribers);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};