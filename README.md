# MiniMax API JavaScript/TypeScript SDK

A unified JavaScript/TypeScript SDK for MiniMax API, supporting both browser and Node.js environments.

## Installation

```bash
npm install minimax-api
```

## Quick Start

```typescript
import { createClient } from 'minimax-api'

const client = createClient('your-api-key')

// Text chat
const response = await client.chat.createCompletion({
  model: 'MiniMax-M2.7',
  messages: [{ role: 'user', content: 'Hello!' }]
})
```

---

## API Reference

### Text Chat

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Chat Completion (OpenAI Compatible) | `POST /v1/chat/completions` | `chat.createCompletion()` | ✅ |
| Streaming Chat (OpenAI Compatible) | `POST /v1/chat/completions` (stream) | `chat.createCompletionStream()` | ⚠️ |
| Message (Anthropic Compatible) | `POST /anthropic/v1/messages` | `chat.createMessage()` | ✅ |
| Streaming Message (Anthropic Compatible) | `POST /anthropic/v1/messages` (stream) | `chat.createMessageStream()` | ⚠️ |

### Speech (Text-to-Audio)

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Sync TTS | `POST /v1/t2a_v2` | `speech.synthesize()` | ✅ |
| Sync TTS (Streaming) | `POST /v1/t2a_v2` (stream) | `speech.synthesizeStream()` | ⚠️ |
| Async TTS Create | `POST /v1/t2a_async_v2` | `speech.createAsyncTask()` | ✅ |
| Async TTS Query | `GET /v1/query/t2a_async_query_v2` | `speech.queryAsyncTask()` | ✅ |
| WebSocket TTS | `WSS /ws/v1/t2a_v2` | `speech.createWebSocketClient()` | ⚠️ |

### Voice Management

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Voice Clone | `POST /v1/voice_clone` | `voice.clone()` | ✅ |
| Voice Design | `POST /v1/voice_design` | `voice.design()` | ✅ |
| Get Voice List | `POST /v1/get_voice` | `voice.list()` | ✅ |
| Delete Voice | `POST /v1/delete_voice` | `voice.delete()` | ✅ |
| Upload Prompt Audio | `POST /v1/files/upload` (purpose: prompt_audio) | `voice.uploadPrompt()` | ✅ |
| Upload Clone Audio | `POST /v1/files/upload` (purpose: voice_clone) | `voice.uploadClone()` | ✅ |

### Video Generation

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Text-to-Video | `POST /v1/video_generation` | `video.generateFromText()` | ✅ |
| Image-to-Video | `POST /v1/video_generation` | `video.generateFromImage()` | ✅ |
| Subject-to-Video | `POST /v1/video_generation` | `video.generateSubjectVideo()` | ✅ |
| First-Letter Video | `POST /v1/video_generation` | `video.generateFirstLetterVideo()` | ✅ |
| Query Task | `GET /v1/query/video_generation` | `video.query()` | ✅ |
| Download Video | `GET /v1/files/retrieve` | `video.download()` | ✅ |

### Image Generation

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Text-to-Image | `POST /v1/image_generation` | `image.generateFromText()` | ✅ |
| Image-to-Image | `POST /v1/image_generation` | `image.generateFromImage()` | ✅ |

### Music Generation

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Music Generation | `POST /v1/music_generation` | `music.generate()` | ✅ |
| Music Generation (Stream) | `POST /v1/music_generation` (stream) | `music.generateStream()` | ⚠️ |
| Lyrics Generation | `POST /v1/lyrics_generation` | `music.generateLyrics()` | ✅ |
| Music Cover Preprocess | `POST /v1/music_cover_preprocess` | `music.preprocessCover()` | ✅ |

### File Management

| API | Endpoint | SDK Method | Integration Test |
|-----|----------|-----------|----------------|
| Upload File | `POST /v1/files/upload` | `file.upload()` | ✅ |
| List Files | `GET /v1/files/list` | `file.list()` | ✅ |
| Retrieve File | `GET /v1/files/retrieve` | `file.retrieve()` | ✅ |
| Retrieve File Content | `GET /v1/files/retrieve_content` | `file.retrieveContent()` | ✅ |
| Delete File | `POST /v1/files/delete` | `file.delete()` | ✅ |

---

## Test Coverage Summary

| Category | Total APIs | Fully Tested | Partially Tested | Not Tested |
|----------|-----------|--------------|------------------|------------|
| Text Chat | 4 | 2 | 2 | 0 |
| Speech (TTS) | 5 | 3 | 2 | 0 |
| Voice Management | 6 | 6 | 0 | 0 |
| Video Generation | 6 | 6 | 0 | 0 |
| Image Generation | 2 | 2 | 0 | 0 |
| Music Generation | 4 | 3 | 1 | 0 |
| File Management | 5 | 5 | 0 | 0 |
| **Total** | **32** | **27** | **5** | **0** |

> **Legend:**
> - ✅ Fully Tested: API called with response validation
> - ⚠️ Partially Tested: API called but limited validation (e.g., streaming only checks status)
> - ❌ Not Tested: No integration test exists

---

## Usage Examples

### Text Chat

```typescript
// OpenAI Compatible
const response = await client.chat.createCompletion({
  model: 'MiniMax-M2.7',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 1024
})

// Anthropic Compatible
const response = await client.chat.createMessage({
  model: 'MiniMax-M2.7',
  messages: [{ role: 'user', content: 'What is 2+2?' }],
  max_tokens: 100
})
```

### Speech Synthesis

```typescript
// Synchronous
const response = await client.speech.synthesize({
  model: 'speech-2.8-hd',
  text: '你好，世界！',
  voice_setting: {
    voice_id: 'Chinese (Mandarin)_Lyrical_Voice',
    speed: 1.0
  },
  audio_setting: {
    sample_rate: 32000,
    format: 'mp3'
  }
})

// Async Task
const task = await client.speech.createAsyncTask({
  model: 'speech-2.8-hd',
  text: 'Long text for async synthesis...',
  voice_setting: { voice_id: 'male-qn-qingse' }
})
// Poll status
const status = await client.speech.queryAsyncTask(task.data.task_id)
```

### Voice Clone

```typescript
// Upload audio first
const uploaded = await client.file.upload(audioFile, 'voice_clone')

// Clone voice
const clone = await client.voice.clone({
  file_id: uploaded.data.file.file_id,
  voice_id: 'my-cloned-voice',
  text: 'Hello, this is a test.',
  model: 'speech-2.8-hd',
  language_boost: 'auto'
})
```

### Voice Design

```typescript
const voice = await client.voice.design({
  prompt: 'A warm and friendly female voice',
  preview_text: 'Hello, this is a test of the voice.'
})
// voice.data.voice_id can be used for synthesis
```

### Video Generation

```typescript
// Text-to-Video
const video = await client.video.generateFromText({
  model: 'MiniMax-Hailuo-2.3',
  prompt: 'A person walking in the park',
  duration: 6,
  resolution: '1080P'
})

// Image-to-Video
const i2v = await client.video.generateFromImage({
  model: 'MiniMax-Hailuo-02',
  prompt: 'The person walking towards the camera',
  first_frame_image: 'https://example.com/image.jpg'
})

// Subject-to-Video (S2V)
const s2v = await client.video.generateSubjectVideo({
  model: 'S2V-01',
  prompt: 'A person dancing',
  subject_reference: [{
    type: 'character',
    image: ['https://example.com/person.jpg']
  }]
})

// First-Letter Video (FL2V)
const fl2v = await client.video.generateFirstLetterVideo({
  model: 'MiniMax-Hailuo-02',
  prompt: 'A person reading a book',
  first_frame_image: 'https://example.com/start.jpg',
  last_frame_image: 'https://example.com/end.jpg'
})

// Query status
const status = await client.video.query(video.data.task_id)

// Download video
const queryResult = await client.video.query(video.data.task_id)
if (queryResult.data.file_id) {
  const download = await client.video.download(queryResult.data.file_id)
  console.log('Video URL:', download.data.file.download_url)
}
```

### Image Generation

```typescript
// Text-to-Image
const image = await client.image.generateFromText({
  model: 'image-01',
  prompt: 'A beautiful sunset over the ocean',
  aspect_ratio: '16:9',
  n: 2
})

// Image-to-Image (with subject reference)
const i2i = await client.image.generateFromImage({
  model: 'image-01',
  prompt: 'Transform into watercolor painting style',
  subject_reference: [{
    type: 'character',
    image_file: 'https://example.com/person.jpg'
  }]
})
```

### Music Generation

```typescript
// Generate music with lyrics
const music = await client.music.generate({
  model: 'music-2.6',
  prompt: 'Upbeat pop music, happy mood',
  lyrics: `[Verse]
Hello world, it's a beautiful day
Every moment feels so right
[Chorus]
Let's celebrate together`,
  is_instrumental: false
})

// Generate lyrics only
const lyrics = await client.music.generateLyrics({
  mode: 'write_full_song',
  prompt: 'A song about summer happiness'
})

// Music Cover Preprocess (two-step cover workflow)
const preprocess = await client.music.preprocessCover({
  model: 'music-cover',
  audio_url: 'https://example.com/song.mp3'
})
// Use preprocess.data.cover_feature_id in music.generate() with model: 'music-cover'
```

### File Management

```typescript
// Upload
const uploaded = await client.file.upload(audioFile, 'voice_clone')

// List
const files = await client.file.list('voice_clone')

// Retrieve
const fileInfo = await client.file.retrieve(uploaded.data.file.file_id)

// Delete
await client.file.delete(uploaded.data.file.file_id, 'voice_clone')
```

---

## Error Handling

```typescript
import { MiniMaxError, AuthenticationError, RateLimitError } from 'minimax-api'

try {
  const response = await client.chat.createCompletion({...})
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key')
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded')
  } else if (error instanceof MiniMaxError) {
    console.error(`API Error: ${error.message}`, error.statusCode)
  }
}
```

---

## Environment Support

### Browser
```html
<script type="module">
  import { createClient } from 'minimax-api'
  const client = createClient('your-api-key')
</script>
```

### Node.js
```typescript
import { createClient } from 'minimax-api'
const client = createClient('your-api-key')
// Requires Node.js 18+ for native fetch
```

---

## Configuration

```typescript
const client = createClient('your-api-key', {
  baseURL: 'https://api.minimaxi.com',  // Optional
  timeout: 60000  // Optional, default 60s (music needs longer)
})
```

---

## License

MIT
