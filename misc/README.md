# Misc Directory

This directory contains test files and generated output samples for the MiniMax API SDK.

## Test Input Files

**Note**: These files need to be prepared by the user. Place them in this directory before running integration tests.

| File | Type | Purpose |
|------|------|---------|
| `*.mp3` | Audio (MP3/M4A/WAV) | Test audio for voice cloning and speech synthesis |
| `*.mp3` | Audio (MP3/WAV/FLAC) | Reference audio for music cover |
| `*.jpeg` / `*.jpg` / `*.png` | Image | Test image for image-to-video generation |

## Generated Output Files

These files are automatically generated when running integration tests.

| File | Type | Description |
|------|------|-------------|
| `output/speech.mp3` | Audio (MP3) | Chinese text-to-speech synthesis output |
| `output/instrumental.mp3` | Audio (MP3) | Generated instrumental music |
| `output/with_lyrics.mp3` | Audio (MP3) | Generated music with lyrics |
| `output/lyrics.txt` | Text | Generated song lyrics |

## Usage

These files are used by integration tests in `tests/integration.test.ts` and `tests/integration-file.test.ts`.

To run the tests that generate output files:

```bash
npm test -- --run tests/integration.test.ts
```

## Notes

- Generated output files will be overwritten each time tests run
- Output files are git-ignored and not committed to the repository
- Test audio files (mp3, jpeg) are committed for reproducibility
