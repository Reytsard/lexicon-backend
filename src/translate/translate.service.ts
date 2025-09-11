import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { TranslateDto } from './dto/translate.dto';
import translate from 'google-translate-api-x';

export interface TranslateOutputInterface {
  input: string;
  tokens: string[];
  context: string;
  englishTranslation: string;
  filipinoTranslation: string;
  googleTranslateEnglish: string;
  googleTranslateTagalog: string;
  googleTranslateKapampangan: string;
}

@Injectable()
export class TranslateService {
  private tokenizer = new natural.WordTokenizer();

  // Assume these arrays are filled from CSV or hardcoded for now
  private sentences: any = [];
  private phrases: any = [];
  private words: any = [];

  async translate(translateDto: TranslateDto) {
    const output: TranslateOutputInterface = {
      input: '',
      tokens: [],
      context: '',
      englishTranslation: '',
      filipinoTranslation: '',
      googleTranslateEnglish: '',
      googleTranslateTagalog: '',
      googleTranslateKapampangan: '',
    };

    // 🧹 Clean input
    const inputSentence = translateDto.wordsToTranslate
      .replace(/[^a-zA-Z0-9\s.,!?;:'"-]/g, '')
      .toLowerCase()
      .trim();

    output.input = inputSentence;
    output.tokens = this.tokenizer.tokenize(inputSentence);

    // 1️⃣ Check whole sentence
    const sentenceMatch = this.sentences.find(
      (s) => s.sentence.toLowerCase() === inputSentence,
    );
    if (sentenceMatch) {
      output.englishTranslation = sentenceMatch.englishTranslation;
      output.filipinoTranslation = sentenceMatch.filipinoTranslation;
      output.context = sentenceMatch.context;
      return output;
    }

    // 2️⃣ Check phrases
    let phraseTranslationEnglish = inputSentence;
    let phraseTranslationFilipino = inputSentence;
    let foundPhrase = false;

    this.phrases.forEach((p) => {
      const regex = new RegExp(`\\b${p.phrase.toLowerCase()}\\b`, 'gi');
      if (regex.test(inputSentence)) {
        phraseTranslationEnglish = phraseTranslationEnglish.replace(
          regex,
          p.englishTranslation,
        );
        phraseTranslationFilipino = phraseTranslationFilipino.replace(
          regex,
          p.filipinoTranslation,
        );
        foundPhrase = true;
      }
    });

    if (foundPhrase) {
      output.englishTranslation = phraseTranslationEnglish;
      output.filipinoTranslation = phraseTranslationFilipino;
      output.context = 'phrase-level translation';
      return output;
    }

    // 3️⃣ Word-by-word fallback
    const englishWords: string[] = [];
    const filipinoWords: string[] = [];

    for (const token of output.tokens) {
      const wordMatch = this.words.find(
        (w: any) => w.word.toLowerCase() === token,
      );
      if (wordMatch) {
        englishWords.push(wordMatch.englishTranslation);
        filipinoWords.push(wordMatch.filipinoTranslation);
      } else {
        englishWords.push(token);
        filipinoWords.push(token);
      }
    }

    output.englishTranslation = englishWords.join(' ');
    output.filipinoTranslation = filipinoWords.join(' ');
    output.context = 'word-level translation';
    output.googleTranslateEnglish = (
      await translate(translateDto.wordsToTranslate, { to: 'en' })
    ).text;
    output.googleTranslateTagalog = (
      await translate(translateDto.wordsToTranslate, { to: 'tl' })
    ).text;
    output.googleTranslateKapampangan = (
      await translate(translateDto.wordsToTranslate, { to: 'pam' })
    ).text;

    return output;
  }
}
