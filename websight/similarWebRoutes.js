const express = require('express');
const router = express.Router();
const cors = require('cors');

const {
  createJiraSubtaskWithLibrary,
  findAssigneeID,
  editJiraTaskStatus,
} = require("./jiraHandler");

const googleOathverification = require("./googleOathVerify");
const calculateQPM = require("./websightCalculator");

router.use(cors());
router.use(express.json());

router.get('/checkstatus', async (req, res) => {
  console.log('Checking server status...');
  res.send('Server is running smoothly! ✅');
});

router.post("/similarWeb", async (req, res) => {
  try {
    await googleOathverification(req.headers.authorization?.replace(/^Bearer\s+/i, ''));
    const responseData = await calculateQPM(req.body);
    res.json(responseData);
  } catch (err) {
    res.status(400).json({
      message: "An error occurred while processing your request.",
      error: err.message
    });
  }
});

router.post("/jiracreator", async (req, res) => {
  try {
    await googleOathverification(req.headers.authorization?.replace(/^Bearer\s+/i, ''));
    const requesterEmail = req.headers['x-user-email']
    const assigneeID = await findAssigneeID(requesterEmail)
    const newIssue = await createJiraSubtaskWithLibrary(assigneeID, req.body)
    await editJiraTaskStatus(newIssue, assigneeID, "Done")
    res.status(200).end();
  } catch (err) {
    res.status(400).json({
      message: "An error occurred while creating jiraTicketCreator.",
      error: err.message
    });
  }
});

module.exports = router;
