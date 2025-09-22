const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Render uses Environment Variables for secrets
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;

const userDatabase = {
    "Jammster": "123456789012345678", // Example: "Game Username": "Discord User ID"
};

app.post('/assign-role', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required.' });

    const discordUserId = userDatabase[username];
    if (!discordUserId) return res.status(404).json({ error: 'Game user not registered.' });

    console.log(`Assigning role to ${username} (Discord ID: ${discordUserId})`);
    const discordApiUrl = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}/roles/${ROLE_ID}`;

    try {
        await axios.put(discordApiUrl, {}, { headers: { 'Authorization': `Bot ${BOT_TOKEN}` } });
        return res.status(200).json({ success: `Role assigned to ${username}.` });
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Failed to assign role.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
