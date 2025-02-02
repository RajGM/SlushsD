const { google } = require('googleapis');
const { getSubtitles } = require('youtube-captions-scraper');
const { parse } = require('url');

const express = require('express');
const router = express.Router();
const { youtubeGeneratorPrompt } = require('../utils/prompts');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { gradeLevel, numberOfQuestions, questionTypes, videoIdOrURL, hardQuestions, mediumQuestions, easyQuestions, transcriptData } = req.body;
        
        console.log("BACKEND DATA:", gradeLevel, numberOfQuestions, questionTypes, videoIdOrURL, hardQuestions, mediumQuestions, easyQuestions, transcriptData)
        // const { videoId } = await getVideoIdFromUrl(videoIdOrURL);

        // // return res.status(400).json({ error: 'Invalid video ID' });
        // if (!videoId) {
        //     return res.status(400).json({ error: 'Invalid video ID' });
        // }

        // let transcript = null;

        // if (videoId) {
        //     transcript = await getTranscriptFromScraper(videoId);
        // }

        // if (!transcript) {
        //     return res.status(400).json({ error: 'Transcript not available' });
        // }

        const prompt = youtubeGeneratorPrompt(gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, transcriptData);

        const result = await generateYoutubeQuestions(prompt);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'Failed to generate questions' });
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

async function generateYoutubeQuestions(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        const questionsText = response.choices[0].message.content.trim();
        return JSON.parse(questionsText);
    } catch (error) {
        console.error('Error generating questions:', error);
        return null;
    }
}

async function getTranscriptFromScraper(videoId) {
    try {
        const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
        return subtitles.map(subtitle => subtitle.text).join(' ');
    } catch (error) {
        console.error('Error fetching transcript using scraper:', error);
        return 'No transcript available.';
    }
}

function getVideoIdFromUrl(url) {
    if (typeof url !== 'string') return null;

    // Regular expressions for different YouTube URL formats
    const regexPatterns = [
        // youtu.be URLs
        /^https?:\/\/youtu\.be\/([^\/\?\&]+)/,
        // youtube.com/watch?v= URLs
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([^&]+)/,
        // youtube.com/embed/ URLs
        /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([^\/\?\&]+)/,
        // youtube.com/v/ URLs
        /^https?:\/\/(?:www\.)?youtube\.com\/v\/([^\/\?\&]+)/,
        // youtube.com/shorts/ URLs
        /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([^\/\?\&]+)/
    ];

    for (const pattern of regexPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}
