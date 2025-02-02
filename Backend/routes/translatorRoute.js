const { google } = require('googleapis');
    
async function getAccessToken() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        },
        scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/cloud-translation', 'https://www.googleapis.com/auth/cloud-platform']
    });

    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();
    console.log("ACCESS TOKEN:", accessToken.token);
    return accessToken.token;
}

async function translateText(text, targetLanguage, accessToken) {
    const endpoint = `https://translation.googleapis.com/v3beta1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/global:translateText`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [text],
                mimeType: 'text/plain',
                targetLanguageCode: targetLanguage,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.translations[0].translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
}

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { originalText, targetLanguage } = req.body;
        console.log(originalText, targetLanguage);

        const accessToken = await getAccessToken();
        console.log("TOKEN:", accessToken);
        const translatedText = await translateText(originalText, targetLanguage, accessToken);

        if (translatedText) {
            return res.status(200).json(translatedText);
        } else {
            return res.status(500).json({ error: 'Failed to translate text' });
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
