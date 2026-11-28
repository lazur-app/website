import type { ReactNode } from "react";
import { AiTool } from "@/components/free-tools/AiTool";
import { AI_TOOLS } from "@/components/free-tools/ai-config";
import { ClickSpeedTest } from "@/components/free-tools/ClickSpeedTest";
import { ColorPicker } from "@/components/free-tools/ColorPicker";
import { DeadPixelTest } from "@/components/free-tools/DeadPixelTest";
import { Dictation } from "@/components/free-tools/Dictation";
import { DictationPractice } from "@/components/free-tools/DictationPractice";
import { EmailSignature } from "@/components/free-tools/EmailSignature";
import { KeyboardTest } from "@/components/free-tools/KeyboardTest";
import { MicTest } from "@/components/free-tools/MicTest";
import { PronunciationChecker } from "@/components/free-tools/PronunciationChecker";
import { ReadPdfAloud } from "@/components/free-tools/ReadPdfAloud";
import { ScreenRecorder } from "@/components/free-tools/ScreenRecorder";
import { SpeakerTest } from "@/components/free-tools/SpeakerTest";
import { Teleprompter } from "@/components/free-tools/Teleprompter";
import { TextToSpeech } from "@/components/free-tools/TextToSpeech";
import { VoiceRecorder } from "@/components/free-tools/VoiceRecorder";
import { VoiceTyping } from "@/components/free-tools/VoiceTyping";
import { WebcamTest } from "@/components/free-tools/WebcamTest";
import { WordCounter } from "@/components/free-tools/WordCounter";
import { WordsToMinutes } from "@/components/free-tools/WordsToMinutes";

type Props = { page?: string };

/**
 * Hand-built widgets (device tests, browser speech, text utilities). Every other tool is an
 * AI tool rendered by the shared AiTool template from components/free-tools/ai-config.ts.
 */
const CUSTOM: Record<string, (p: Props) => ReactNode> = {
  "mic-test": () => <MicTest />,
  "webcam-test": (p) => <WebcamTest {...p} />,
  "speaker-test": (p) => <SpeakerTest {...p} />,
  "keyboard-test": (p) => <KeyboardTest {...p} />,
  "click-speed-test": (p) => <ClickSpeedTest {...p} />,
  "dead-pixel-test": (p) => <DeadPixelTest {...p} />,
  "screen-recorder": (p) => <ScreenRecorder {...p} />,
  dictation: (p) => <Dictation {...p} />,
  "voice-typing": (p) => <VoiceTyping {...p} />,
  "voice-recorder": (p) => <VoiceRecorder {...p} />,
  "text-to-speech": (p) => <TextToSpeech {...p} />,
  "pronunciation-checker": (p) => <PronunciationChecker {...p} />,
  "dictation-practice": (p) => <DictationPractice {...p} />,
  teleprompter: (p) => <Teleprompter {...p} />,
  "words-to-minutes": (p) => <WordsToMinutes {...p} />,
  "word-counter": (p) => <WordCounter {...p} />,
  "color-picker": (p) => <ColorPicker {...p} />,
  "email-signature": (p) => <EmailSignature {...p} />,
  "read-pdf-aloud": (p) => <ReadPdfAloud {...p} />,
};

export function renderWidget(subdomain: string, page?: string): ReactNode {
  const custom = CUSTOM[subdomain];
  if (custom) return custom({ page });
  if (AI_TOOLS[subdomain]) return <AiTool tool={subdomain} />;
  return null;
}
