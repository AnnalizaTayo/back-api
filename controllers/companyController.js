const Company = require('../models/Company');
const optimizeImage = require('../utils/optimizeImage');
const sharp = require('sharp');

// Update an existing company
exports.updateCompany = async(req, res) => {
  
  const { about, mission, vision, email, landLineNumber, mobileNumber, website, address  } = req.body;
  const { companyLogo, highlightCollection } = req.files;
  
  console.log("************************");
  console.log('this is the req.files');
  console.log(req.files);
  console.log(req.body);
  console.log("************************");

  try {
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    let logo = null;
    let highlight = null;

    const contact = {
      email: email,
      landLineNumber: landLineNumber,
      mobileNumber: mobileNumber,
      website: website,
      address: address
    }
    if(!(typeof companyLogo === "undefined")){
      const optimizedLogoImageBuffer = await optimizeImage(companyLogo[0].buffer, maxSize);
      
      const pngBuffer = await sharp(optimizedLogoImageBuffer)
        .resize(800, 600, { fit: 'inside' })
        .toFormat('png')
        .toBuffer();

      const faviconBuffer = await sharp(optimizedLogoImageBuffer)
        .resize(64, 64, { fit: 'inside' })
        .toFormat('png')
        .toBuffer();

      logo = {
        filename: 'logo',
        png: pngBuffer,
        favicon: faviconBuffer,
        contentType: companyLogo[0].mimetype,
      }
    }
    if(!(typeof highlightCollection === "undefined")){
      const optimizedHighlightImageBuffer = await optimizeImage(highlightCollection[0].buffer, maxSize);

      highlight = {
        filename: 'highlightCollection',
        data: optimizedHighlightImageBuffer,
        contentType: highlightCollection[0].mimetype,
      }

    }
    //const companyId = process.env.COMPANY_ID;

    const updatedCompany = await Company.findOne();

    if(updatedCompany) {
      if(logo!=null){
        updatedCompany.companyLogo = logo;
      }
      updatedCompany.about = about;
      updatedCompany.mission = mission;
      updatedCompany.vision = vision;
      updatedCompany.contact = contact;
      if(highlight!=null){
        updatedCompany.highlightCollection = highlight;
      }

      console.log("updatedCompanyvvvvv");
      console.log(updatedCompany);
      console.log("updatedCompany^^^^^");


      const savedCompany = await updatedCompany.save();

      const newCompanyData = {
        companyName: savedCompany.companyName,
        contact: {
          email: savedCompany.contact.email,
          landLineNumber: savedCompany.contact.landLineNumber,
          mobileNumber: savedCompany.contact.mobileNumber,
          website: savedCompany.contact.website,
          address: savedCompany.contact.address
        },
        about: savedCompany.about,
        mission: savedCompany.mission,
        vision: savedCompany.vision
      }

      res.status(200).json({ message: 'Company updated successfully', company: newCompanyData });
      
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  } 
}

// Update an existing company's contact information
exports.updateContact = (req, res) => {
    const { email, landLineNumber, mobileNumber, website, social, address } = req.body;
  
    Company.findByIdAndUpdate(
      req.params.companyId,
      {
        'contact.email': email,
        'contact.landLineNumber': landLineNumber,
        'contact.mobileNumber': mobileNumber,
        'contact.website': website,
        'contact.social': social,
        'contact.address': address,
      },
      { new: true },
      (err, updatedCompany) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error updating company contact' });
        } else {
          res.json(updatedCompany);
        }
      }
    );
};

// Retrieve company information by ID
exports.getCompany = async(req, res) => {
  console.log('fetching data');
    try {
      const company = await Company.findOne().select('-companyLogo.png -companyLogo.favicon -highlightCollection.data -_id');
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (err) {       
      console.error(err);
      res.status(500).json({ error: 'Error fetching company' });
    }
};

// Retrieve company information by ID
exports.getCompanyNoImages = async(req, res) => {
  console.log('fetching data');
    try {
      const company = await Company.findOne().select('-companyLogo -highlightCollection');
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (err) {       
      console.error(err);
      res.status(500).json({ error: 'Error fetching company' });
    }
};

// Retrive Images
exports.getCompanyLogo = async(req, res) => {
  try {
    console.log("trying to fetch logo");
    const company = await Company.findOne();

    if (!company || !company.companyLogo) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', company.companyLogo.contentType);
    res.send(company.companyLogo.png);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// Retrive Images
exports.getCompanyFavicon = async(req, res) => {
  try {
    console.log('trying to fetch favicon');
    const company = await Company.findOne();

    if (!company || !company.companyLogo) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', company.companyLogo.contentType);
    res.send(company.companyLogo.favicon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCompanyHighlight = async(req, res) => {
  try {
    const company = await Company.findOne({ 'highlightCollection.filename': "highlightCollection" });

    if (!company || !company.highlightCollection) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', company.highlightCollection.contentType);
    res.send(company.highlightCollection.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
