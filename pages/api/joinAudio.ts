import { NextApiRequest, NextApiResponse } from 'next';
import { getAudioUrl } from 'google-tts-api';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust size limit if needed
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;
    const audioFile1 = req.body.audioFile1;
    const audioFile2 = req.body.audioFile2;

    if (!text || !audioFile1 || !audioFile2) {
      return res.status(400).json({ message: 'Text and two audio files are required' });
    }

    try {
      // Step 1: Convert text to speech using google-tts-api
      const ttsUrl = getAudioUrl(text, { lang: 'en', slow: false });
      const ttsFilePath = path.join(process.cwd(), 'public', 'tts.mp3');
      
      // Fetch the TTS audio and save it locally
      const ttsResponse = await fetch(ttsUrl);
      const ttsStream = fs.createWriteStream(ttsFilePath);
      ttsResponse.body?.pipe(ttsStream);

      await new Promise((resolve, reject) => {
        ttsStream.on('finish', resolve);
        ttsStream.on('error', reject);
      });

      // Step 2: Merge the two audio files and the generated TTS
      const outputFilePath = path.join(process.cwd(), 'public', 'merged_output.mp3');
      const audio1Path = path.join(process.cwd(), 'public', audioFile1); // Path of first audio file
      const audio2Path = path.join(process.cwd(), 'public', audioFile2); // Path of second audio file

      ffmpeg.setFfmpegPath(ffmpegPath as string);
      ffmpeg()
        .input(audio1Path)   // First audio file
        .input(audio2Path)   // Second audio file
        .input(ttsFilePath)  // TTS-generated file
        .on('error', (err) => {
          console.error('Error merging audio:', err);
          res.status(500).json({ message: 'Error processing audio' });
        })
        .on('end', () => {
          // Cleanup: Delete the temporary TTS file
          fs.unlinkSync(ttsFilePath);

          // Return the merged audio file
          res.status(200).json({ message: 'Audio merged successfully', outputUrl: `/merged_output.mp3` });
        })
        .mergeToFile(outputFilePath,"");
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
