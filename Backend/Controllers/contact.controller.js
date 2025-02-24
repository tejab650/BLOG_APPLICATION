import contactModel from "../Models/contact.model.js";

export const addContactController = async (req, res) => {
  console.log("Inside the add comment controller");
  console.log(req.body);
  const { name, email, message } = req.body;
  try {
    const Data = new contactModel({
      name: name,
      email: email,
      message: message,
      authorId: req.user.ID,
    });

    await Data.save();
    return res.status(200).json({ message: "Message was sent" });
  } catch (error) {
    console.log("Error in add contact controller is : ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  console.log("Inside the get all contacts controller");
  try {
    const allContacts = await contactModel.find().sort({createdAt:-1});
    return res
      .status(200)
      .json({ message: "Successfully retrived", contacts: allContacts });
  } catch (error) {
    console.log("Error in add contact controller is : ", error.message);
    return res.status(500).json({ message: error.message });
  }
};
