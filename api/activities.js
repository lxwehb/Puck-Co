// api/activities.js
const Airtable = require("airtable");

export default async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME).select().firstPage();
    const activities = records.map((record) => ({ id: record.id, ...record.fields }));
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};