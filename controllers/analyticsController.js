const PageView = require('../models/Views');

exports.viewsCount = async(req, res) => {
    try {
        if (!req.session.pageViews) {
        req.session.pageViews = 1;
        } else {
        req.session.pageViews++;
        }

        const doc = await PageView.findOneAndUpdate(
        { sessionId: req.session.id },
        { $set: { pageViews: req.session.pageViews } },
        { upsert: true, new: true }
        );
        
        console.log('Updated page views in MongoDB:', doc);
        res.send(`You have viewed this site ${req.session.pageViews} times.`);
    } catch (err) {
        console.error('Error updating page views in MongoDB:', err);
        res.status(500).send('An error occurred while updating page views.');
    }
};

exports.getVisitCount = async(req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const pageViewData = await PageView.find({
            createdAt: { $gte: weekAgo, $lte: today },
        });

        const daysOfWeek = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

        const dailyVisitCountsData = daysOfWeek.map(day => {
            const sessionsOnDay = pageViewData.filter(pageView =>
                new Date(pageView.createdAt).getDay() === daysOfWeek.indexOf(day)
            );
            return { name: day, visits: sessionsOnDay.length };
        });

        const totalWeeklyVisitCounts = pageViewData.length;

        const chartData = dailyVisitCountsData;

        res.status(200).json({ chartData, totalWeeklyVisitCounts });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getViewCount = async(req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const pageViewData = await PageView.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekAgo, $lte: today },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    pageViews: { $sum: '$pageViews' },
                },
            },
            {
                $project: {
                    dayOfWeek: { $subtract: ['$_id', 1] },
                    pageViews: 1,
                    _id: 0,
                },
            },
        ]);

        const daysOfWeek = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

        const dailyPageViewsData = daysOfWeek.map((day, index) => {
            const dayData = pageViewData.find(data => data.dayOfWeek === index);
            return { name: day, pageViews: dayData ? dayData.pageViews : 0 };
        });

        const totalWeeklyPageViews = pageViewData.reduce((total, data) => total + data.pageViews, 0);

        const chartData = dailyPageViewsData;

        res.status(200).json({ chartData, totalWeeklyPageViews });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


