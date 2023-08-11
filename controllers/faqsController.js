const Faqs = require('../models/Faqs');

exports.addFaqs = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Fields are required.' });
    }

    const existingFaqs = await Faqs.findOne({ question }).exec();

    if (existingFaqs) {
      return res.status(409).json({ message: 'Duplicate entry of questions.' });
    }

    const newSubscriber = new Faqs({ question, answer });

    await newSubscriber.save(); 

    return res.status(201).json({ message: 'New FAQ entry has been uploaded successfully.' });
  } catch (error) {
    console.error('Error in subscribe', error);
    return res.status(500).json({ message: 'Internal server error' }); 
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faqs.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFaqs = async (req, res) => {
  const faqsId = req.params.faqsId;
  console.log(req.body)
  if (!faqsId) {
      return res.status(400).json({message:'Faqs ID Required'});
  }

  const result = await Faqs.findOneAndDelete({ _id: faqsId }).exec();

  if(!result){
      return res.status(400).json({ message: 'Query not Found'});
  }

  res.json({ message: `FAQ with ID ${faqsId} has been deleted successfully.` });

};

exports.updateFaqs = async (req, res) => {
  console.log('*******************');
  console.log('received data update request: FaqsImg updateById');
  console.log('*******************');

  const faqsId = req.params.faqsId; // Retrieve faqsId from the request parameters

  console.log('*******************');
  console.log(`received data update request for ${faqsId}`);
  console.log('*******************');

  const updateFields = {...req.body};

  console.log('This is the received data:');
  console.log('*******************');
  console.log(req.body);
  console.log('*******************');
  console.log('*******************');
  console.log('Processing to update');
  console.log('*******************');


  try {
    const updatedFaqs  = await Faqs.findByIdAndUpdate(faqsId,
      updateFields,
      { new: true }
    );

    if (!updatedFaqs) {
      console.log('*******************');
      console.log(`Query not Found`);
      console.log('*******************');
      return res.status(404).json({ message: 'Faqs not found' });
    } else {
      console.log('*******************');
      console.log('This is the updated FAQs:');
      console.log('*******************');
      console.log(updatedFaqs);
      console.log('*******************');
    }

    console.log('*******************');
    console.log(`Faqs ${faqsId} update successful!`);
    console.log('*******************');

    res.status(200).json(updatedFaqs);
  } catch (error) {
    res.status(500).json({ message: 'Error updating the Faqs' });
  }

};
/* 
exports.getFaqsById = async (req, res) => {
  console.log('*******************');
  console.log('received data retrieval request: FaqsImg getById');
  console.log('*******************');

  const faqsId = req.params.faqsId; // Retrieve companyId from the request parameters

  console.log('*******************');
  console.log(`received data retrieval request for ${faqsId}`);
  console.log('*******************');
  try {
    const faqs = await Faqs.findOne({ _id: faqsId });

    console.log('*******************');
    console.log('Retrieved faqs:');
    console.log(faqs);
    console.log('*******************');

    if (!faqs) {
      console.log('*******************');
      console.log(`Faqs ${faqsId} not found`);
      console.log('*******************');
      return res.status(404).json({ error: 'Faqs not found' });
    } else {
      console.log('*******************');
      console.log(`Faqs ${faqs} Found!`);
      console.log('*******************');
    }

    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the faqs thumbnail' });
  }
};

 */

exports.getOneFaqsById = async (req, res) => {
  try {
    const faqsId = req.params.faqsId;
    console.log('*******************');
    console.log(`Received data retrieval request: FAQs ${faqsId}`);
    console.log('*******************');

    const faqs = await Faqs.findOne({ _id: faqsId });

    if (!faqs) {
      console.log('FAQs not found');
      return res.status(404).json({ error: 'FAQs not found' });
    }

    console.log('Retrieval successful! Sending data...');
    console.log('*******************');

    console.log(faqs);
    console.log('*******************');

    res.status(200).json({ faqs });
    console.log('Data is now available');
    console.log('*******************');
  } catch (error) {
    console.error('Error retrieving FAQs:', error.message);
    res.status(500).json({ error: 'Failed to retrieve FAQs' });
  }
};
