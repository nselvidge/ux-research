const AnalysisJobList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          created_at_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          created_at_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          cursor: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The pagination cursor value.',
          },
          status: {
            type: 'array',
            items: { type: 'string', enum: ['completed', 'errored', 'in_progress'] },
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        next: { type: ['string', 'null'] },
        previous: { type: ['string', 'null'] },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              name: { type: ['string', 'null'], readOnly: true },
              status: {
                enum: ['in_progress', 'completed', 'errored'],
                type: 'string',
                description: '`in_progress` `completed` `errored`',
              },
              errors: {
                type: 'array',
                items: { type: 'object', additionalProperties: true },
                readOnly: true,
              },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
            },
            required: ['created_at', 'errors', 'id', 'name', 'status'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const AnalysisJobRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this job.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        name: { type: ['string', 'null'], readOnly: true },
        status: {
          enum: ['in_progress', 'completed', 'errored'],
          type: 'string',
          description: '`in_progress` `completed` `errored`',
        },
        errors: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
          readOnly: true,
        },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
      },
      required: ['created_at', 'errors', 'id', 'name', 'status'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BillingUsageRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          end: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          start: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        bot_total: {
          type: 'number',
          format: 'double',
          description: 'The total amount of time, in seconds, of bots used.',
          minimum: -1.7976931348623157e308,
          maximum: 1.7976931348623157e308,
        },
      },
      required: ['bot_total'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotAnalyzeCreate = {
  body: {
    type: 'object',
    properties: {
      assemblyai_async_transcription: {
        type: 'object',
        properties: {
          language: { type: 'string' },
          language_code: {
            type: 'string',
            description: 'Docs: https://www.assemblyai.com/docs/walkthroughs#specifying-a-language',
          },
          speaker_labels: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#speaker-labels-speaker-diarization',
          },
          word_boost: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
          },
          boost_param: {
            type: 'string',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
          },
          custom_spelling: {
            type: 'object',
            additionalProperties: true,
            description: 'Docs: https://www.assemblyai.com/docs/core-transcription#custom-spelling',
          },
          disfluencies: {
            type: 'boolean',
            description: 'Docs: https://www.assemblyai.com/docs/core-transcription#filler-words',
          },
          language_detection: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-language-detection',
          },
          punctuate: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
          },
          format_text: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
          },
          filter_profanity: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/core-transcription#profanity-filtering',
          },
          redact_pii_policies: {
            type: 'array',
            items: { type: 'string' },
            description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#pii-redaction',
          },
          auto_highlights: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/audio-intelligence#detect-important-phrases-and-words',
          },
          content_safety: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/audio-intelligence#content-moderation',
          },
          iab_categories: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/audio-intelligence#topic-detection-iab-classification',
          },
          sentiment_analysis: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/audio-intelligence#sentiment-analysis',
          },
          summarization: {
            type: 'boolean',
            description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
          },
          summary_model: {
            type: 'string',
            description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
          },
          summary_type: {
            type: 'string',
            description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
          },
          auto_chapters: {
            type: 'boolean',
            description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#auto-chapters',
          },
          entity_detection: {
            type: 'boolean',
            description:
              'Docs: https://www.assemblyai.com/docs/audio-intelligence#entity-detection',
          },
        },
      },
      rev_async_transcription: {
        type: 'object',
        properties: {
          detect_language: { type: 'boolean' },
          language: {
            type: 'string',
            description:
              'Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=language&t=request',
          },
          skip_diarization: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_diarization&t=request',)",
          },
          skip_postprocessing: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_postprocessing&t=request',)",
          },
          skip_punctuation: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_punctuation&t=request',)",
          },
          remove_disfluencies: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=remove_disfluencies&t=request',)",
          },
          remove_atmospherics: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=remove_atmospherics&t=request',)",
          },
          filter_profanity: {
            type: 'boolean',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=filter_profanity&t=request',)",
          },
          custom_vocabulary_id: {
            type: 'string',
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=)application/json&path=custom_vocabulary_id&t=request',)",
          },
          custom_vocabularies: {
            type: 'array',
            items: { type: 'string' },
            description:
              "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=custom_vocabularies&t=request',)",
          },
        },
      },
      deepgram_async_transcription: {
        type: 'object',
        properties: {
          tier: {
            type: 'string',
            description: 'Docs: https://developers.deepgram.com/documentation/features/tier/',
          },
          model: {
            type: 'string',
            description: 'Docs: https://developers.deepgram.com/documentation/features/model/',
          },
          version: {
            type: 'string',
            description: 'Docs: https://developers.deepgram.com/documentation/features/version/',
          },
          language: {
            type: 'string',
            description: 'Docs: https://developers.deepgram.com/documentation/features/language/',
          },
          detect_language: {
            type: 'boolean',
            description:
              'Docs: https://developers.deepgram.com/documentation/features/detect-language/',
          },
          punctuate: {
            type: 'boolean',
            description: 'Docs: https://developers.deepgram.com/documentation/features/punctuate/',
          },
          profanity_filter: {
            type: 'boolean',
            description:
              'Docs: https://developers.deepgram.com/documentation/features/profanity-filter/',
          },
          redact: {
            type: 'array',
            items: { type: 'string' },
            description: 'Docs: https://developers.deepgram.com/documentation/features/redact/',
          },
          diarize: {
            type: 'boolean',
            description: 'Docs: https://developers.deepgram.com/documentation/features/diarize/',
          },
          diarize_version: {
            type: 'string',
            description: 'Docs: https://developers.deepgram.com/documentation/features/diarize/',
          },
          smart_format: {
            type: 'boolean',
            description:
              'Docs: https://developers.deepgram.com/documentation/features/smart-format/',
          },
          numerals: {
            type: 'boolean',
            description: 'Docs: https://developers.deepgram.com/documentation/features/numerals/',
          },
          search: {
            type: 'array',
            items: { type: 'string' },
            description: 'Docs: https://developers.deepgram.com/documentation/features/search/',
          },
          replace: {
            type: 'array',
            items: { type: 'string' },
            description: 'Docs: https://developers.deepgram.com/documentation/features/replace/',
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Docs: https://developers.deepgram.com/documentation/features/keywords/',
          },
          summarize: {
            type: 'boolean',
            description: 'Docs: https://developers.deepgram.com/documentation/features/summarize/',
          },
          detect_topics: {
            type: 'boolean',
            description:
              'Docs: https://developers.deepgram.com/documentation/features/detect-topics/',
          },
          tag: {
            type: 'boolean',
            description: 'Docs: https://developers.deepgram.com/documentation/features/tag/',
          },
        },
      },
    },
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: { id: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' } },
        required: ['id'],
      },
    ],
  },
  response: {
    '201': {
      type: 'object',
      properties: {
        assemblyai_async_transcription: {
          type: 'object',
          properties: {
            language: { type: 'string' },
            language_code: {
              type: 'string',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#specifying-a-language',
            },
            speaker_labels: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#speaker-labels-speaker-diarization',
            },
            word_boost: {
              type: 'array',
              items: { type: 'string' },
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
            },
            boost_param: {
              type: 'string',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
            },
            custom_spelling: {
              type: 'object',
              additionalProperties: true,
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#custom-spelling',
            },
            disfluencies: {
              type: 'boolean',
              description: 'Docs: https://www.assemblyai.com/docs/core-transcription#filler-words',
            },
            language_detection: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-language-detection',
            },
            punctuate: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
            },
            format_text: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
            },
            filter_profanity: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/core-transcription#profanity-filtering',
            },
            redact_pii_policies: {
              type: 'array',
              items: { type: 'string' },
              description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#pii-redaction',
            },
            auto_highlights: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/audio-intelligence#detect-important-phrases-and-words',
            },
            content_safety: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/audio-intelligence#content-moderation',
            },
            iab_categories: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/audio-intelligence#topic-detection-iab-classification',
            },
            sentiment_analysis: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/audio-intelligence#sentiment-analysis',
            },
            summarization: {
              type: 'boolean',
              description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
            },
            summary_model: {
              type: 'string',
              description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
            },
            summary_type: {
              type: 'string',
              description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
            },
            auto_chapters: {
              type: 'boolean',
              description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#auto-chapters',
            },
            entity_detection: {
              type: 'boolean',
              description:
                'Docs: https://www.assemblyai.com/docs/audio-intelligence#entity-detection',
            },
          },
        },
        rev_async_transcription: {
          type: 'object',
          properties: {
            detect_language: { type: 'boolean' },
            language: {
              type: 'string',
              description:
                'Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=language&t=request',
            },
            skip_diarization: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_diarization&t=request',)",
            },
            skip_postprocessing: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_postprocessing&t=request',)",
            },
            skip_punctuation: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=skip_punctuation&t=request',)",
            },
            remove_disfluencies: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=remove_disfluencies&t=request',)",
            },
            remove_atmospherics: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=remove_atmospherics&t=request',)",
            },
            filter_profanity: {
              type: 'boolean',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=filter_profanity&t=request',)",
            },
            custom_vocabulary_id: {
              type: 'string',
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=)application/json&path=custom_vocabulary_id&t=request',)",
            },
            custom_vocabularies: {
              type: 'array',
              items: { type: 'string' },
              description:
                "('Docs: https://docs.rev.ai/api/asynchronous/reference/#operation/SubmitTranscriptionJob!ct=application/json&path=custom_vocabularies&t=request',)",
            },
          },
        },
        deepgram_async_transcription: {
          type: 'object',
          properties: {
            tier: {
              type: 'string',
              description: 'Docs: https://developers.deepgram.com/documentation/features/tier/',
            },
            model: {
              type: 'string',
              description: 'Docs: https://developers.deepgram.com/documentation/features/model/',
            },
            version: {
              type: 'string',
              description: 'Docs: https://developers.deepgram.com/documentation/features/version/',
            },
            language: {
              type: 'string',
              description: 'Docs: https://developers.deepgram.com/documentation/features/language/',
            },
            detect_language: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/detect-language/',
            },
            punctuate: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/punctuate/',
            },
            profanity_filter: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/profanity-filter/',
            },
            redact: {
              type: 'array',
              items: { type: 'string' },
              description: 'Docs: https://developers.deepgram.com/documentation/features/redact/',
            },
            diarize: {
              type: 'boolean',
              description: 'Docs: https://developers.deepgram.com/documentation/features/diarize/',
            },
            diarize_version: {
              type: 'string',
              description: 'Docs: https://developers.deepgram.com/documentation/features/diarize/',
            },
            smart_format: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/smart-format/',
            },
            numerals: {
              type: 'boolean',
              description: 'Docs: https://developers.deepgram.com/documentation/features/numerals/',
            },
            search: {
              type: 'array',
              items: { type: 'string' },
              description: 'Docs: https://developers.deepgram.com/documentation/features/search/',
            },
            replace: {
              type: 'array',
              items: { type: 'string' },
              description: 'Docs: https://developers.deepgram.com/documentation/features/replace/',
            },
            keywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Docs: https://developers.deepgram.com/documentation/features/keywords/',
            },
            summarize: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/summarize/',
            },
            detect_topics: {
              type: 'boolean',
              description:
                'Docs: https://developers.deepgram.com/documentation/features/detect-topics/',
            },
            tag: {
              type: 'boolean',
              description: 'Docs: https://developers.deepgram.com/documentation/features/tag/',
            },
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotCreate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      video_url: {
        type: 'string',
        format: 'uri',
        readOnly: true,
        description:
          'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
      },
      recording: { type: ['string', 'null'], format: 'uuid' },
      media_retention_end: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        description:
          'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
      },
      status_changes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', readOnly: true },
            message: { type: 'string', readOnly: true },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            sub_code: { type: 'string', readOnly: true },
          },
          required: ['code', 'created_at', 'message', 'sub_code'],
        },
        readOnly: true,
      },
      meeting_metadata: {
        readOnly: true,
        type: ['object', 'null'],
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            readOnly: true,
            description: 'The title of the meeting the bot has joined.',
          },
        },
      },
      meeting_participants: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', readOnly: true },
            name: { type: 'string', readOnly: true },
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string', readOnly: true },
                  created_at: { type: 'string', format: 'date-time', readOnly: true },
                },
                required: ['code', 'created_at'],
              },
              readOnly: true,
            },
          },
          required: ['events', 'id', 'name'],
        },
        readOnly: true,
      },
      meeting_url: {
        type: ['string', 'null'],
        description:
          "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
      },
      bot_name: {
        type: 'string',
        writeOnly: true,
        default: 'Meeting Notetaker',
        description: 'The name of the bot that will be displayed in the call.',
        maxLength: 100,
      },
      join_at: {
        type: ['string', 'null'],
        format: 'date-time',
        description:
          "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
      },
      real_time_transcription: {
        writeOnly: true,
        description: 'The settings for real-time transcription.',
        type: 'object',
        required: ['destination_url'],
        properties: {
          destination_url: { type: 'string', format: 'uri' },
          partial_results: { type: 'boolean', default: false },
        },
      },
      real_time_media: {
        writeOnly: true,
        description: 'The settings for real-time media output.',
        type: 'object',
        properties: {
          rtmp_destination_url: { type: 'string' },
          websocket_video_destination_url: { type: 'string' },
          websocket_audio_destination_url: { type: 'string' },
          websocket_speaker_timeline_destination_url: { type: 'string' },
          websocket_speaker_timeline_exclude_null_speaker: {
            type: 'boolean',
            default: true,
            description:
              'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
          },
          webhook_call_events_destination_url: {
            type: 'string',
            description:
              "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
          },
        },
      },
      transcription_options: {
        writeOnly: true,
        type: 'object',
        required: ['provider'],
        properties: {
          provider: {
            enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
            type: 'string',
          },
          assembly_ai: {
            title: 'AssemblyAi Real-time Transcription Settings',
            description:
              'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
            type: 'object',
            properties: { word_boost: { type: 'array', items: { type: 'string' } } },
          },
          deepgram: {
            title: 'Deepgram Real-time Transcription Settings',
            description:
              'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
            type: 'object',
            properties: {
              tier: { type: 'string' },
              model: { type: 'string' },
              version: { type: 'string' },
              language: { type: 'string' },
              profanity_filter: { type: 'boolean' },
              redact: { type: 'array', items: { type: 'string' } },
              diarize: { type: 'boolean' },
              diarize_version: { type: 'string' },
              ner: { type: 'boolean' },
              alternatives: { type: 'integer' },
              numerals: { type: 'boolean' },
              search: { type: 'array', items: { type: 'string' } },
              replace: { type: 'array', items: { type: 'string' } },
              keywords: { type: 'array', items: { type: 'string' } },
              interim_results: { type: 'boolean' },
              endpointing: { type: 'boolean' },
            },
          },
          rev: {
            title: 'Rev Real-time Transcription Settings',
            description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
            type: 'object',
            properties: {
              language: { type: 'string' },
              metadata: { type: 'string' },
              custom_vocabulary_id: { type: 'string', maxLength: 200 },
              filter_profanity: { type: 'boolean' },
              remove_disfluencies: { type: 'boolean' },
              delete_after_seconds: { type: 'integer' },
              detailed_partials: { type: 'boolean' },
              start_ts: {
                type: 'number',
                format: 'double',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              max_segment_duration_seconds: { type: 'integer' },
              transcriber: { type: 'string' },
              enable_speaker_switch: { type: 'boolean' },
              skip_postprocessing: { type: 'boolean' },
              priority: { type: 'string' },
            },
          },
          aws_transcribe: {
            title: 'AWS Transcribe Real-time Transcription Settings',
            description:
              'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
            type: 'object',
            properties: {
              language_code: { type: 'string' },
              content_redaction_type: { type: 'string' },
              language_model_name: { type: 'string' },
              language_options: { type: 'string' },
              language_identification: { type: 'boolean' },
              partial_results_stability: { type: 'string' },
              pii_entity_types: { type: 'string' },
              preferred_language: { type: 'string' },
              show_speaker_label: { type: 'boolean' },
              vocabulary_filter_method: { type: 'string' },
              vocabulary_filter_names: { type: 'string' },
              vocabulary_names: { type: 'string' },
            },
          },
        },
      },
      chat: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to send chat messages.',
        type: 'object',
        properties: {
          on_bot_join: {
            type: 'object',
            required: ['message', 'send_to'],
            properties: {
              send_to: { enum: ['host', 'everyone', 'everyone_except_host'], type: 'string' },
              message: { type: 'string', maxLength: 4096 },
            },
          },
          on_participant_join: {
            type: 'object',
            required: ['exclude_host', 'message'],
            properties: {
              message: { type: 'string', maxLength: 4096 },
              exclude_host: { type: 'boolean' },
            },
          },
        },
      },
      zoom: {
        writeOnly: true,
        description: 'Zoom specific parameters',
        type: 'object',
        properties: {
          join_token_url: {
            type: 'string',
            format: 'uri',
            description:
              'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
          },
          zak_url: {
            type: 'string',
            format: 'uri',
            description:
              'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
          },
        },
      },
      google_meet: {
        writeOnly: true,
        description: 'Google Meet specific parameters',
        type: 'object',
        properties: {
          login_required: {
            type: ['boolean', 'null'],
            description:
              "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
          },
        },
      },
      automatic_leave: {
        writeOnly: true,
        type: 'object',
        properties: {
          waiting_room_timeout: {
            type: 'integer',
            minimum: 30,
            default: 1200,
            description:
              'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
          },
          noone_joined_timeout: {
            type: 'integer',
            minimum: 30,
            default: 1200,
            description:
              '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
          },
          everyone_left_timeout: {
            type: 'integer',
            minimum: 1,
            default: 2,
            description:
              '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
          },
        },
      },
      automatic_video_output: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to output video.',
        type: 'object',
        required: ['in_call_recording'],
        properties: {
          in_call_recording: {
            description:
              'The video that will be automatically output when the bot is in the in_call_recording state',
            type: 'object',
            required: ['b64_data', 'kind'],
            properties: {
              kind: {
                description: 'The kind of data encoded in b64_data',
                enum: ['jpeg'],
                type: 'string',
              },
              b64_data: {
                type: 'string',
                description:
                  'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                maxLength: 1835008,
              },
            },
          },
        },
      },
      automatic_audio_output: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to output audio.',
        type: 'object',
        required: ['in_call_recording'],
        properties: {
          in_call_recording: {
            type: 'object',
            required: ['data'],
            properties: {
              data: {
                type: 'object',
                required: ['b64_data', 'kind'],
                properties: {
                  kind: {
                    description: 'The kind of data encoded in b64_data',
                    enum: ['mp3'],
                    type: 'string',
                  },
                  b64_data: {
                    type: 'string',
                    description:
                      'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                    maxLength: 1835008,
                  },
                },
              },
              replay_on_participant_join: {
                description:
                  'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                type: 'object',
                required: ['debounce_interval'],
                properties: {
                  debounce_interval: {
                    type: 'integer',
                    description:
                      'The amount of time to wait for additional participants to join before replaying the audio.',
                  },
                },
              },
            },
          },
        },
      },
      calendar_meetings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', readOnly: true },
            start_time: { type: 'string', format: 'date-time', readOnly: true },
            end_time: { type: 'string', format: 'date-time', readOnly: true },
            calendar_user: {
              readOnly: true,
              type: 'object',
              required: ['external_id', 'id'],
              properties: {
                id: { type: 'string', format: 'uuid', readOnly: true },
                external_id: { type: 'string', readOnly: true },
              },
            },
          },
          required: ['calendar_user', 'end_time', 'id', 'start_time'],
        },
        readOnly: true,
      },
      recording_mode: {
        writeOnly: true,
        default: 'speaker_view',
        description: 'The layout of the output video.',
        enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
        type: 'string',
      },
      recording_mode_options: {
        writeOnly: true,
        description: 'Additional options for the output video layout.',
        type: 'object',
        required: ['participant_video_when_screenshare'],
        properties: {
          participant_video_when_screenshare: {
            description:
              'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot',
            enum: ['hide', 'beside', 'overlap'],
            type: 'string',
          },
        },
      },
    },
    required: [
      'calendar_meetings',
      'id',
      'media_retention_end',
      'meeting_metadata',
      'meeting_participants',
      'meeting_url',
      'status_changes',
      'video_url',
    ],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '507': {
      description:
        'If no bots are available in the ad-hoc bot pool the HTTP 507 code is returned. The ad-hoc bot pool is replenished every few minutes so retrying the request will eventually succeed.',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotDeleteMediaCreate = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotDestroy = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
} as const;
const BotIntelligenceRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: { '200': { $schema: 'http://json-schema.org/draft-04/schema#' } },
} as const;
const BotLeaveCallCreate = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          join_at_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          join_at_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: ['string', 'null'],
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: ['string', 'null'],
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              video_url: {
                type: 'string',
                format: 'uri',
                readOnly: true,
                description:
                  'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
              },
              recording: { type: ['string', 'null'], format: 'uuid' },
              media_retention_end: {
                type: 'string',
                format: 'date-time',
                readOnly: true,
                description:
                  'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
              },
              status_changes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    message: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                    sub_code: { type: 'string', readOnly: true },
                  },
                  required: ['code', 'created_at', 'message', 'sub_code'],
                },
                readOnly: true,
              },
              meeting_metadata: {
                readOnly: true,
                type: ['object', 'null'],
                required: ['title'],
                properties: {
                  title: {
                    type: 'string',
                    readOnly: true,
                    description: 'The title of the meeting the bot has joined.',
                  },
                },
              },
              meeting_participants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', readOnly: true },
                    name: { type: 'string', readOnly: true },
                    events: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          code: { type: 'string', readOnly: true },
                          created_at: { type: 'string', format: 'date-time', readOnly: true },
                        },
                        required: ['code', 'created_at'],
                      },
                      readOnly: true,
                    },
                  },
                  required: ['events', 'id', 'name'],
                },
                readOnly: true,
              },
              meeting_url: {
                type: ['string', 'null'],
                description:
                  "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
              },
              bot_name: {
                type: 'string',
                writeOnly: true,
                default: 'Meeting Notetaker',
                description: 'The name of the bot that will be displayed in the call.',
                maxLength: 100,
              },
              join_at: {
                type: ['string', 'null'],
                format: 'date-time',
                description:
                  "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
              },
              real_time_transcription: {
                writeOnly: true,
                description: 'The settings for real-time transcription.',
                type: 'object',
                required: ['destination_url'],
                properties: {
                  destination_url: { type: 'string', format: 'uri' },
                  partial_results: { type: 'boolean', default: false },
                },
              },
              real_time_media: {
                writeOnly: true,
                description: 'The settings for real-time media output.',
                type: 'object',
                properties: {
                  rtmp_destination_url: { type: 'string' },
                  websocket_video_destination_url: { type: 'string' },
                  websocket_audio_destination_url: { type: 'string' },
                  websocket_speaker_timeline_destination_url: { type: 'string' },
                  websocket_speaker_timeline_exclude_null_speaker: {
                    type: 'boolean',
                    default: true,
                    description:
                      'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
                  },
                  webhook_call_events_destination_url: {
                    type: 'string',
                    description:
                      "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
                  },
                },
              },
              transcription_options: {
                writeOnly: true,
                type: 'object',
                required: ['provider'],
                properties: {
                  provider: {
                    enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
                    type: 'string',
                    description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
                  },
                  assembly_ai: {
                    title: 'AssemblyAi Real-time Transcription Settings',
                    description:
                      'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
                    type: 'object',
                    properties: { word_boost: { type: 'array', items: { type: 'string' } } },
                  },
                  deepgram: {
                    title: 'Deepgram Real-time Transcription Settings',
                    description:
                      'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
                    type: 'object',
                    properties: {
                      tier: { type: 'string' },
                      model: { type: 'string' },
                      version: { type: 'string' },
                      language: { type: 'string' },
                      profanity_filter: { type: 'boolean' },
                      redact: { type: 'array', items: { type: 'string' } },
                      diarize: { type: 'boolean' },
                      diarize_version: { type: 'string' },
                      ner: { type: 'boolean' },
                      alternatives: { type: 'integer' },
                      numerals: { type: 'boolean' },
                      search: { type: 'array', items: { type: 'string' } },
                      replace: { type: 'array', items: { type: 'string' } },
                      keywords: { type: 'array', items: { type: 'string' } },
                      interim_results: { type: 'boolean' },
                      endpointing: { type: 'boolean' },
                    },
                  },
                  rev: {
                    title: 'Rev Real-time Transcription Settings',
                    description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
                    type: 'object',
                    properties: {
                      language: { type: 'string' },
                      metadata: { type: 'string' },
                      custom_vocabulary_id: { type: 'string', maxLength: 200 },
                      filter_profanity: { type: 'boolean' },
                      remove_disfluencies: { type: 'boolean' },
                      delete_after_seconds: { type: 'integer' },
                      detailed_partials: { type: 'boolean' },
                      start_ts: {
                        type: 'number',
                        format: 'double',
                        minimum: -1.7976931348623157e308,
                        maximum: 1.7976931348623157e308,
                      },
                      max_segment_duration_seconds: { type: 'integer' },
                      transcriber: { type: 'string' },
                      enable_speaker_switch: { type: 'boolean' },
                      skip_postprocessing: { type: 'boolean' },
                      priority: { type: 'string' },
                    },
                  },
                  aws_transcribe: {
                    title: 'AWS Transcribe Real-time Transcription Settings',
                    description:
                      'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
                    type: 'object',
                    properties: {
                      language_code: { type: 'string' },
                      content_redaction_type: { type: 'string' },
                      language_model_name: { type: 'string' },
                      language_options: { type: 'string' },
                      language_identification: { type: 'boolean' },
                      partial_results_stability: { type: 'string' },
                      pii_entity_types: { type: 'string' },
                      preferred_language: { type: 'string' },
                      show_speaker_label: { type: 'boolean' },
                      vocabulary_filter_method: { type: 'string' },
                      vocabulary_filter_names: { type: 'string' },
                      vocabulary_names: { type: 'string' },
                    },
                  },
                },
              },
              chat: {
                writeOnly: true,
                description: '(BETA) Settings for the bot to send chat messages.',
                type: 'object',
                properties: {
                  on_bot_join: {
                    type: 'object',
                    required: ['message', 'send_to'],
                    properties: {
                      send_to: {
                        enum: ['host', 'everyone', 'everyone_except_host'],
                        type: 'string',
                        description: '`host` `everyone` `everyone_except_host`',
                      },
                      message: { type: 'string', maxLength: 4096 },
                    },
                  },
                  on_participant_join: {
                    type: 'object',
                    required: ['exclude_host', 'message'],
                    properties: {
                      message: { type: 'string', maxLength: 4096 },
                      exclude_host: { type: 'boolean' },
                    },
                  },
                },
              },
              zoom: {
                writeOnly: true,
                description: 'Zoom specific parameters',
                type: 'object',
                properties: {
                  join_token_url: {
                    type: 'string',
                    format: 'uri',
                    description:
                      'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
                  },
                  zak_url: {
                    type: 'string',
                    format: 'uri',
                    description:
                      'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
                  },
                },
              },
              google_meet: {
                writeOnly: true,
                description: 'Google Meet specific parameters',
                type: 'object',
                properties: {
                  login_required: {
                    type: ['boolean', 'null'],
                    description:
                      "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
                  },
                },
              },
              automatic_leave: {
                writeOnly: true,
                type: 'object',
                properties: {
                  waiting_room_timeout: {
                    type: 'integer',
                    minimum: 30,
                    default: 1200,
                    description:
                      'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
                  },
                  noone_joined_timeout: {
                    type: 'integer',
                    minimum: 30,
                    default: 1200,
                    description:
                      '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
                  },
                  everyone_left_timeout: {
                    type: 'integer',
                    minimum: 1,
                    default: 2,
                    description:
                      '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
                  },
                },
              },
              automatic_video_output: {
                writeOnly: true,
                description: '(BETA) Settings for the bot to output video.',
                type: 'object',
                required: ['in_call_recording'],
                properties: {
                  in_call_recording: {
                    description:
                      'The video that will be automatically output when the bot is in the in_call_recording state',
                    type: 'object',
                    required: ['b64_data', 'kind'],
                    properties: {
                      kind: {
                        description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                        enum: ['jpeg'],
                        type: 'string',
                      },
                      b64_data: {
                        type: 'string',
                        description:
                          'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                        maxLength: 1835008,
                      },
                    },
                  },
                },
              },
              automatic_audio_output: {
                writeOnly: true,
                description: '(BETA) Settings for the bot to output audio.',
                type: 'object',
                required: ['in_call_recording'],
                properties: {
                  in_call_recording: {
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: {
                        type: 'object',
                        required: ['b64_data', 'kind'],
                        properties: {
                          kind: {
                            description: 'The kind of data encoded in b64_data\n\n`mp3`',
                            enum: ['mp3'],
                            type: 'string',
                          },
                          b64_data: {
                            type: 'string',
                            description:
                              'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                            maxLength: 1835008,
                          },
                        },
                      },
                      replay_on_participant_join: {
                        description:
                          'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                        type: 'object',
                        required: ['debounce_interval'],
                        properties: {
                          debounce_interval: {
                            type: 'integer',
                            description:
                              'The amount of time to wait for additional participants to join before replaying the audio.',
                          },
                        },
                      },
                    },
                  },
                },
              },
              calendar_meetings: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', readOnly: true },
                    start_time: { type: 'string', format: 'date-time', readOnly: true },
                    end_time: { type: 'string', format: 'date-time', readOnly: true },
                    calendar_user: {
                      readOnly: true,
                      type: 'object',
                      required: ['external_id', 'id'],
                      properties: {
                        id: { type: 'string', format: 'uuid', readOnly: true },
                        external_id: { type: 'string', readOnly: true },
                      },
                    },
                  },
                  required: ['calendar_user', 'end_time', 'id', 'start_time'],
                },
                readOnly: true,
              },
              recording_mode: {
                writeOnly: true,
                default: 'speaker_view',
                description:
                  'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
                enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
                type: 'string',
              },
              recording_mode_options: {
                writeOnly: true,
                description: 'Additional options for the output video layout.',
                type: 'object',
                required: ['participant_video_when_screenshare'],
                properties: {
                  participant_video_when_screenshare: {
                    description:
                      'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
                    enum: ['hide', 'beside', 'overlap'],
                    type: 'string',
                  },
                },
              },
            },
            required: [
              'calendar_meetings',
              'id',
              'media_retention_end',
              'meeting_metadata',
              'meeting_participants',
              'meeting_url',
              'status_changes',
              'video_url',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotPartialUpdate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      video_url: {
        type: 'string',
        format: 'uri',
        readOnly: true,
        description:
          'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
      },
      recording: { type: ['string', 'null'], format: 'uuid' },
      media_retention_end: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        description:
          'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
      },
      status_changes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', readOnly: true },
            message: { type: 'string', readOnly: true },
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            sub_code: { type: 'string', readOnly: true },
          },
          required: ['code', 'created_at', 'message', 'sub_code'],
        },
        readOnly: true,
      },
      meeting_metadata: {
        readOnly: true,
        type: ['object', 'null'],
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            readOnly: true,
            description: 'The title of the meeting the bot has joined.',
          },
        },
      },
      meeting_participants: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', readOnly: true },
            name: { type: 'string', readOnly: true },
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string', readOnly: true },
                  created_at: { type: 'string', format: 'date-time', readOnly: true },
                },
                required: ['code', 'created_at'],
              },
              readOnly: true,
            },
          },
          required: ['events', 'id', 'name'],
        },
        readOnly: true,
      },
      meeting_url: {
        type: ['string', 'null'],
        description:
          "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
      },
      bot_name: {
        type: 'string',
        writeOnly: true,
        default: 'Meeting Notetaker',
        description: 'The name of the bot that will be displayed in the call.',
        maxLength: 100,
      },
      join_at: {
        type: ['string', 'null'],
        format: 'date-time',
        description:
          "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
      },
      real_time_transcription: {
        writeOnly: true,
        description: 'The settings for real-time transcription.',
        type: 'object',
        required: ['destination_url'],
        properties: {
          destination_url: { type: 'string', format: 'uri' },
          partial_results: { type: 'boolean', default: false },
        },
      },
      real_time_media: {
        writeOnly: true,
        description: 'The settings for real-time media output.',
        type: 'object',
        properties: {
          rtmp_destination_url: { type: 'string' },
          websocket_video_destination_url: { type: 'string' },
          websocket_audio_destination_url: { type: 'string' },
          websocket_speaker_timeline_destination_url: { type: 'string' },
          websocket_speaker_timeline_exclude_null_speaker: {
            type: 'boolean',
            default: true,
            description:
              'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
          },
          webhook_call_events_destination_url: {
            type: 'string',
            description:
              "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
          },
        },
      },
      transcription_options: {
        writeOnly: true,
        type: 'object',
        required: ['provider'],
        properties: {
          provider: {
            enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
            type: 'string',
          },
          assembly_ai: {
            title: 'AssemblyAi Real-time Transcription Settings',
            description:
              'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
            type: 'object',
            properties: { word_boost: { type: 'array', items: { type: 'string' } } },
          },
          deepgram: {
            title: 'Deepgram Real-time Transcription Settings',
            description:
              'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
            type: 'object',
            properties: {
              tier: { type: 'string' },
              model: { type: 'string' },
              version: { type: 'string' },
              language: { type: 'string' },
              profanity_filter: { type: 'boolean' },
              redact: { type: 'array', items: { type: 'string' } },
              diarize: { type: 'boolean' },
              diarize_version: { type: 'string' },
              ner: { type: 'boolean' },
              alternatives: { type: 'integer' },
              numerals: { type: 'boolean' },
              search: { type: 'array', items: { type: 'string' } },
              replace: { type: 'array', items: { type: 'string' } },
              keywords: { type: 'array', items: { type: 'string' } },
              interim_results: { type: 'boolean' },
              endpointing: { type: 'boolean' },
            },
          },
          rev: {
            title: 'Rev Real-time Transcription Settings',
            description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
            type: 'object',
            properties: {
              language: { type: 'string' },
              metadata: { type: 'string' },
              custom_vocabulary_id: { type: 'string', maxLength: 200 },
              filter_profanity: { type: 'boolean' },
              remove_disfluencies: { type: 'boolean' },
              delete_after_seconds: { type: 'integer' },
              detailed_partials: { type: 'boolean' },
              start_ts: {
                type: 'number',
                format: 'double',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              max_segment_duration_seconds: { type: 'integer' },
              transcriber: { type: 'string' },
              enable_speaker_switch: { type: 'boolean' },
              skip_postprocessing: { type: 'boolean' },
              priority: { type: 'string' },
            },
          },
          aws_transcribe: {
            title: 'AWS Transcribe Real-time Transcription Settings',
            description:
              'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
            type: 'object',
            properties: {
              language_code: { type: 'string' },
              content_redaction_type: { type: 'string' },
              language_model_name: { type: 'string' },
              language_options: { type: 'string' },
              language_identification: { type: 'boolean' },
              partial_results_stability: { type: 'string' },
              pii_entity_types: { type: 'string' },
              preferred_language: { type: 'string' },
              show_speaker_label: { type: 'boolean' },
              vocabulary_filter_method: { type: 'string' },
              vocabulary_filter_names: { type: 'string' },
              vocabulary_names: { type: 'string' },
            },
          },
        },
      },
      chat: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to send chat messages.',
        type: 'object',
        properties: {
          on_bot_join: {
            type: 'object',
            required: ['message', 'send_to'],
            properties: {
              send_to: { enum: ['host', 'everyone', 'everyone_except_host'], type: 'string' },
              message: { type: 'string', maxLength: 4096 },
            },
          },
          on_participant_join: {
            type: 'object',
            required: ['exclude_host', 'message'],
            properties: {
              message: { type: 'string', maxLength: 4096 },
              exclude_host: { type: 'boolean' },
            },
          },
        },
      },
      zoom: {
        writeOnly: true,
        description: 'Zoom specific parameters',
        type: 'object',
        properties: {
          join_token_url: {
            type: 'string',
            format: 'uri',
            description:
              'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
          },
          zak_url: {
            type: 'string',
            format: 'uri',
            description:
              'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
          },
        },
      },
      google_meet: {
        writeOnly: true,
        description: 'Google Meet specific parameters',
        type: 'object',
        properties: {
          login_required: {
            type: ['boolean', 'null'],
            description:
              "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
          },
        },
      },
      automatic_leave: {
        writeOnly: true,
        type: 'object',
        properties: {
          waiting_room_timeout: {
            type: 'integer',
            minimum: 30,
            default: 1200,
            description:
              'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
          },
          noone_joined_timeout: {
            type: 'integer',
            minimum: 30,
            default: 1200,
            description:
              '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
          },
          everyone_left_timeout: {
            type: 'integer',
            minimum: 1,
            default: 2,
            description:
              '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
          },
        },
      },
      automatic_video_output: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to output video.',
        type: 'object',
        required: ['in_call_recording'],
        properties: {
          in_call_recording: {
            description:
              'The video that will be automatically output when the bot is in the in_call_recording state',
            type: 'object',
            required: ['b64_data', 'kind'],
            properties: {
              kind: {
                description: 'The kind of data encoded in b64_data',
                enum: ['jpeg'],
                type: 'string',
              },
              b64_data: {
                type: 'string',
                description:
                  'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                maxLength: 1835008,
              },
            },
          },
        },
      },
      automatic_audio_output: {
        writeOnly: true,
        description: '(BETA) Settings for the bot to output audio.',
        type: 'object',
        required: ['in_call_recording'],
        properties: {
          in_call_recording: {
            type: 'object',
            required: ['data'],
            properties: {
              data: {
                type: 'object',
                required: ['b64_data', 'kind'],
                properties: {
                  kind: {
                    description: 'The kind of data encoded in b64_data',
                    enum: ['mp3'],
                    type: 'string',
                  },
                  b64_data: {
                    type: 'string',
                    description:
                      'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                    maxLength: 1835008,
                  },
                },
              },
              replay_on_participant_join: {
                description:
                  'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                type: 'object',
                required: ['debounce_interval'],
                properties: {
                  debounce_interval: {
                    type: 'integer',
                    description:
                      'The amount of time to wait for additional participants to join before replaying the audio.',
                  },
                },
              },
            },
          },
        },
      },
      calendar_meetings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', readOnly: true },
            start_time: { type: 'string', format: 'date-time', readOnly: true },
            end_time: { type: 'string', format: 'date-time', readOnly: true },
            calendar_user: {
              readOnly: true,
              type: 'object',
              required: ['external_id', 'id'],
              properties: {
                id: { type: 'string', format: 'uuid', readOnly: true },
                external_id: { type: 'string', readOnly: true },
              },
            },
          },
          required: ['calendar_user', 'end_time', 'id', 'start_time'],
        },
        readOnly: true,
      },
      recording_mode: {
        writeOnly: true,
        default: 'speaker_view',
        description: 'The layout of the output video.',
        enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
        type: 'string',
      },
      recording_mode_options: {
        writeOnly: true,
        description: 'Additional options for the output video layout.',
        type: 'object',
        required: ['participant_video_when_screenshare'],
        properties: {
          participant_video_when_screenshare: {
            description:
              'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot',
            enum: ['hide', 'beside', 'overlap'],
            type: 'string',
          },
        },
      },
    },
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotScreenshotsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          bot_id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The ID of the bot for which to retrieve the screenshots',
          },
        },
        required: ['bot_id'],
      },
      {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          recorded_at_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          recorded_at_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: ['string', 'null'],
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: ['string', 'null'],
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              recorded_at: { type: 'string', format: 'date-time', readOnly: true },
              url: {
                type: 'string',
                format: 'uri',
                readOnly: true,
                description: 'A URL where the bot screenshot can be acccessed from.',
              },
            },
            required: ['id', 'recorded_at', 'url'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotScreenshotsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot screenshot.',
          },
          bot_id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The ID of the bot for which to retrieve the screenshot',
          },
        },
        required: ['id', 'bot_id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        recorded_at: { type: 'string', format: 'date-time', readOnly: true },
        url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description: 'A URL where the bot screenshot can be acccessed from.',
        },
      },
      required: ['id', 'recorded_at', 'url'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotSendChatMessageCreate = {
  body: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        default: 'everyone',
        description:
          'The person or group that the message will be sent to. On non-Zoom platforms, "everyone" is currently the only supported option, meaning the message will be sent to everyone in the meeting.',
      },
      message: { type: 'string', description: 'The message that will be sent.', maxLength: 4096 },
    },
    required: ['message'],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotSpeakerTimelineList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
      {
        type: 'object',
        properties: {
          exclude_null_speaker: {
            type: 'boolean',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'The name of the speaker.' },
          user_id: {
            type: 'integer',
            description:
              'The ID of the speaker, which can be used to match speaker names to real-time audio and video streams.',
          },
          timestamp: {
            type: 'number',
            format: 'double',
            description:
              'The time relative to the start of the recording when this participant started speaking, in seconds.',
            minimum: -1.7976931348623157e308,
            maximum: 1.7976931348623157e308,
          },
        },
        required: ['name', 'timestamp', 'user_id'],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotTranscribeCreate = {
  body: {
    type: 'object',
    properties: {
      language: { type: 'string' },
      language_code: {
        type: 'string',
        description: 'Docs: https://www.assemblyai.com/docs/walkthroughs#specifying-a-language',
      },
      speaker_labels: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/core-transcription#speaker-labels-speaker-diarization',
      },
      word_boost: {
        type: 'array',
        items: { type: 'string' },
        description: 'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
      },
      boost_param: {
        type: 'string',
        description: 'Docs: https://www.assemblyai.com/docs/core-transcription#custom-vocabulary',
      },
      custom_spelling: {
        type: 'object',
        additionalProperties: true,
        description: 'Docs: https://www.assemblyai.com/docs/core-transcription#custom-spelling',
      },
      disfluencies: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/core-transcription#filler-words',
      },
      language_detection: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-language-detection',
      },
      punctuate: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
      },
      format_text: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/core-transcription#automatic-punctuation-and-casing',
      },
      filter_profanity: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/core-transcription#profanity-filtering',
      },
      redact_pii_policies: {
        type: 'array',
        items: { type: 'string' },
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#pii-redaction',
      },
      auto_highlights: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/audio-intelligence#detect-important-phrases-and-words',
      },
      content_safety: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#content-moderation',
      },
      iab_categories: {
        type: 'boolean',
        description:
          'Docs: https://www.assemblyai.com/docs/audio-intelligence#topic-detection-iab-classification',
      },
      sentiment_analysis: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#sentiment-analysis',
      },
      summarization: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
      },
      summary_model: {
        type: 'string',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
      },
      summary_type: {
        type: 'string',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#summarization',
      },
      auto_chapters: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#auto-chapters',
      },
      entity_detection: {
        type: 'boolean',
        description: 'Docs: https://www.assemblyai.com/docs/audio-intelligence#entity-detection',
      },
    },
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          description:
            'A URL where the video recorded by the bot can be downloaded. This is null while the recording is in progress, and will be populated when the recording is completed. The returned URL is valid for 6 hours from the API call. A fresh URL can be obtained at any point by calling the API again.',
        },
        recording: { type: ['string', 'null'], format: 'uuid' },
        media_retention_end: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description:
            'After this date the video and transcript will be deleted. This date is 7 days from when the recording ended.',
        },
        status_changes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', readOnly: true },
              message: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              sub_code: { type: 'string', readOnly: true },
            },
            required: ['code', 'created_at', 'message', 'sub_code'],
          },
          readOnly: true,
        },
        meeting_metadata: {
          readOnly: true,
          type: ['object', 'null'],
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              readOnly: true,
              description: 'The title of the meeting the bot has joined.',
            },
          },
        },
        meeting_participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', readOnly: true },
              name: { type: 'string', readOnly: true },
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', readOnly: true },
                    created_at: { type: 'string', format: 'date-time', readOnly: true },
                  },
                  required: ['code', 'created_at'],
                },
                readOnly: true,
              },
            },
            required: ['events', 'id', 'name'],
          },
          readOnly: true,
        },
        meeting_url: {
          type: ['string', 'null'],
          description:
            "The url of the meeting. For example, https://zoom.us/j/123?pwd=456. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's meeting_url will be cleared.",
        },
        bot_name: {
          type: 'string',
          writeOnly: true,
          default: 'Meeting Notetaker',
          description: 'The name of the bot that will be displayed in the call.',
          maxLength: 100,
        },
        join_at: {
          type: ['string', 'null'],
          format: 'date-time',
          description:
            "The time at which the bot will join the call, formatted in ISO 8601. This field can only be read from scheduled bots that have not yet joined a call. Once a bot has joined a call, it's join_at will be cleared.",
        },
        real_time_transcription: {
          writeOnly: true,
          description: 'The settings for real-time transcription.',
          type: 'object',
          required: ['destination_url'],
          properties: {
            destination_url: { type: 'string', format: 'uri' },
            partial_results: { type: 'boolean', default: false },
          },
        },
        real_time_media: {
          writeOnly: true,
          description: 'The settings for real-time media output.',
          type: 'object',
          properties: {
            rtmp_destination_url: { type: 'string' },
            websocket_video_destination_url: { type: 'string' },
            websocket_audio_destination_url: { type: 'string' },
            websocket_speaker_timeline_destination_url: { type: 'string' },
            websocket_speaker_timeline_exclude_null_speaker: {
              type: 'boolean',
              default: true,
              description:
                'Set to false to include null active speaker events in the speaker timeline websocket. Defaults to true.',
            },
            webhook_call_events_destination_url: {
              type: 'string',
              description:
                "(BETA) Receive webhooks for in call events('bot.participant_join'/'bot.participant_leave'/'bot.active_speaker_notify')",
            },
          },
        },
        transcription_options: {
          writeOnly: true,
          type: 'object',
          required: ['provider'],
          properties: {
            provider: {
              enum: ['deepgram', 'assembly_ai', 'rev', 'aws_transcribe', 'symbl', 'none'],
              type: 'string',
              description: '`deepgram` `assembly_ai` `rev` `aws_transcribe` `symbl` `none`',
            },
            assembly_ai: {
              title: 'AssemblyAi Real-time Transcription Settings',
              description:
                'Docs: https://www.assemblyai.com/docs/walkthroughs#realtime-streaming-transcription',
              type: 'object',
              properties: { word_boost: { type: 'array', items: { type: 'string' } } },
            },
            deepgram: {
              title: 'Deepgram Real-time Transcription Settings',
              description:
                'Docs: https://developers.deepgram.com/api-reference/transcription/#transcribe-live-streaming-audio',
              type: 'object',
              properties: {
                tier: { type: 'string' },
                model: { type: 'string' },
                version: { type: 'string' },
                language: { type: 'string' },
                profanity_filter: { type: 'boolean' },
                redact: { type: 'array', items: { type: 'string' } },
                diarize: { type: 'boolean' },
                diarize_version: { type: 'string' },
                ner: { type: 'boolean' },
                alternatives: { type: 'integer' },
                numerals: { type: 'boolean' },
                search: { type: 'array', items: { type: 'string' } },
                replace: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                interim_results: { type: 'boolean' },
                endpointing: { type: 'boolean' },
              },
            },
            rev: {
              title: 'Rev Real-time Transcription Settings',
              description: 'Docs: https://docs.rev.ai/api/streaming/requests/',
              type: 'object',
              properties: {
                language: { type: 'string' },
                metadata: { type: 'string' },
                custom_vocabulary_id: { type: 'string', maxLength: 200 },
                filter_profanity: { type: 'boolean' },
                remove_disfluencies: { type: 'boolean' },
                delete_after_seconds: { type: 'integer' },
                detailed_partials: { type: 'boolean' },
                start_ts: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                max_segment_duration_seconds: { type: 'integer' },
                transcriber: { type: 'string' },
                enable_speaker_switch: { type: 'boolean' },
                skip_postprocessing: { type: 'boolean' },
                priority: { type: 'string' },
              },
            },
            aws_transcribe: {
              title: 'AWS Transcribe Real-time Transcription Settings',
              description:
                'Docs: https://docs.aws.amazon.com/transcribe/latest/APIReference/API_streaming_StartStreamTranscription.html',
              type: 'object',
              properties: {
                language_code: { type: 'string' },
                content_redaction_type: { type: 'string' },
                language_model_name: { type: 'string' },
                language_options: { type: 'string' },
                language_identification: { type: 'boolean' },
                partial_results_stability: { type: 'string' },
                pii_entity_types: { type: 'string' },
                preferred_language: { type: 'string' },
                show_speaker_label: { type: 'boolean' },
                vocabulary_filter_method: { type: 'string' },
                vocabulary_filter_names: { type: 'string' },
                vocabulary_names: { type: 'string' },
              },
            },
          },
        },
        chat: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to send chat messages.',
          type: 'object',
          properties: {
            on_bot_join: {
              type: 'object',
              required: ['message', 'send_to'],
              properties: {
                send_to: {
                  enum: ['host', 'everyone', 'everyone_except_host'],
                  type: 'string',
                  description: '`host` `everyone` `everyone_except_host`',
                },
                message: { type: 'string', maxLength: 4096 },
              },
            },
            on_participant_join: {
              type: 'object',
              required: ['exclude_host', 'message'],
              properties: {
                message: { type: 'string', maxLength: 4096 },
                exclude_host: { type: 'boolean' },
              },
            },
          },
        },
        zoom: {
          writeOnly: true,
          description: 'Zoom specific parameters',
          type: 'object',
          properties: {
            join_token_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make a GET request to, in order to retrieve the Zoom Join Token for Local Recording, which the V2 Zoom bot uses to automatically record. This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingLocalRecordingJoinToken',
            },
            zak_url: {
              type: 'string',
              format: 'uri',
              description:
                'A URL which Recall will make  GET request to, in order to retrieve the ZAK. The V1 Zoom bot uses this to join meetings that require authentication to join.This token can be generated through the Zoom API. Docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/userZak',
            },
          },
        },
        google_meet: {
          writeOnly: true,
          description: 'Google Meet specific parameters',
          type: 'object',
          properties: {
            login_required: {
              type: ['boolean', 'null'],
              description:
                "Specify if the bot should always login to Google before joining the meeting. This value will override the default value set on bot's Google Meet login credentials on the account. When set to 'false', the bot will only login if required by the meeting.",
            },
          },
        },
        automatic_leave: {
          writeOnly: true,
          type: 'object',
          properties: {
            waiting_room_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                'The number of seconds after which the bot will automatically leave the call, if it has not been let in from the waiting room.',
            },
            noone_joined_timeout: {
              type: 'integer',
              minimum: 30,
              default: 1200,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if it has joined the meeting but no other participant has joined.',
            },
            everyone_left_timeout: {
              type: 'integer',
              minimum: 1,
              default: 2,
              description:
                '(BETA) The number of seconds after which the bot will automatically leave the call, if there were other participants in the call who have all left.',
            },
          },
        },
        automatic_video_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output video.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              description:
                'The video that will be automatically output when the bot is in the in_call_recording state',
              type: 'object',
              required: ['b64_data', 'kind'],
              properties: {
                kind: {
                  description: 'The kind of data encoded in b64_data\n\n`jpeg`',
                  enum: ['jpeg'],
                  type: 'string',
                },
                b64_data: {
                  type: 'string',
                  description:
                    'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                  maxLength: 1835008,
                },
              },
            },
          },
        },
        automatic_audio_output: {
          writeOnly: true,
          description: '(BETA) Settings for the bot to output audio.',
          type: 'object',
          required: ['in_call_recording'],
          properties: {
            in_call_recording: {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'object',
                  required: ['b64_data', 'kind'],
                  properties: {
                    kind: {
                      description: 'The kind of data encoded in b64_data\n\n`mp3`',
                      enum: ['mp3'],
                      type: 'string',
                    },
                    b64_data: {
                      type: 'string',
                      description:
                        'Data encoded in Base64 format, using the standard alphabet (specified here: https://datatracker.ietf.org/doc/html/rfc4648#section-4)',
                      maxLength: 1835008,
                    },
                  },
                },
                replay_on_participant_join: {
                  description:
                    'Specify this parameter if you want the audio to be replayed when additional participants join the call.',
                  type: 'object',
                  required: ['debounce_interval'],
                  properties: {
                    debounce_interval: {
                      type: 'integer',
                      description:
                        'The amount of time to wait for additional participants to join before replaying the audio.',
                    },
                  },
                },
              },
            },
          },
        },
        calendar_meetings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_user: {
                readOnly: true,
                type: 'object',
                required: ['external_id', 'id'],
                properties: {
                  id: { type: 'string', format: 'uuid', readOnly: true },
                  external_id: { type: 'string', readOnly: true },
                },
              },
            },
            required: ['calendar_user', 'end_time', 'id', 'start_time'],
          },
          readOnly: true,
        },
        recording_mode: {
          writeOnly: true,
          default: 'speaker_view',
          description:
            'The layout of the output video.\n\n`speaker_view` `gallery_view` `gallery_view_v2`',
          enum: ['speaker_view', 'gallery_view', 'gallery_view_v2'],
          type: 'string',
        },
        recording_mode_options: {
          writeOnly: true,
          description: 'Additional options for the output video layout.',
          type: 'object',
          required: ['participant_video_when_screenshare'],
          properties: {
            participant_video_when_screenshare: {
              description:
                'The layout of participant video streams when a screen is being shared. More docs: https://recallai.readme.io/reference/bot-faqs#5-what-do-the-recording-modes-look-like-when-specified-in-create-bot\n\n`hide` `beside` `overlap`',
              enum: ['hide', 'beside', 'overlap'],
              type: 'string',
            },
          },
        },
      },
      required: [
        'calendar_meetings',
        'id',
        'media_retention_end',
        'meeting_metadata',
        'meeting_participants',
        'meeting_url',
        'status_changes',
        'video_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const BotTranscriptList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this bot.',
          },
        },
        required: ['id'],
      },
      {
        type: 'object',
        properties: {
          enhanced_diarization: {
            type: 'boolean',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          speaker: {
            type: 'string',
            description: 'The name of the meeting participant who said these words.',
          },
          words: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                start_timestamp: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                end_timestamp: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
              },
              required: ['end_timestamp', 'start_timestamp', 'text'],
            },
          },
        },
        required: ['speaker', 'words'],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarAccountsAccessTokenRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          uuid: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
        },
        required: ['uuid'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: { access_token: { type: 'string', readOnly: true } },
      required: ['access_token'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '400': {
      type: 'object',
      properties: {
        code: {
          enum: ['no_oauth_credentials', 'bad_refresh_token', 'error'],
          type: 'string',
          description: '`no_oauth_credentials` `bad_refresh_token` `error`',
        },
        message: { type: 'string' },
      },
      required: ['code', 'message'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarAccountsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          uuid: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
        },
        required: ['uuid'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        platform: { type: 'string', readOnly: true },
        email: { type: 'string', format: 'email', readOnly: true },
      },
      required: ['email', 'id', 'platform'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarAuthenticateCreate = {
  body: {
    type: 'object',
    properties: {
      user_id: { type: 'string', description: 'The unique id of the user in your system.' },
    },
    required: ['user_id'],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'The authentication token for the user.' },
      },
      required: ['token'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarEventsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          calendar_id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          cursor: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The pagination cursor value.',
          },
          ical_uid: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          ordering: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Which field to use when ordering the results.',
          },
          start_time: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          start_time__gte: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          start_time__lte: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          updated_at__gte: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        next: { type: ['string', 'null'] },
        previous: { type: ['string', 'null'] },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              start_time: { type: 'string', format: 'date-time', readOnly: true },
              end_time: { type: 'string', format: 'date-time', readOnly: true },
              calendar_id: { type: 'string', format: 'uuid', readOnly: true },
              raw: { type: 'object', additionalProperties: true, readOnly: true },
              platform: { type: 'string', readOnly: true },
              platform_id: { type: 'string', readOnly: true },
              ical_uid: { type: 'string', readOnly: true },
              meeting_platform: {
                readOnly: true,
                nullable: true,
                oneOf: [
                  {
                    enum: ['zoom', 'google_meet', 'microsoft_teams', 'webex'],
                    type: 'string',
                    description: '`zoom` `google_meet` `microsoft_teams` `webex`',
                  },
                  { enum: [null] },
                ],
              },
              meeting_url: { type: ['string', 'null'], readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              updated_at: { type: 'string', format: 'date-time', readOnly: true },
              is_deleted: { type: 'boolean', readOnly: true },
            },
            required: [
              'calendar_id',
              'created_at',
              'end_time',
              'ical_uid',
              'id',
              'is_deleted',
              'meeting_platform',
              'meeting_url',
              'platform',
              'platform_id',
              'raw',
              'start_time',
              'updated_at',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarEventsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar event.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        start_time: { type: 'string', format: 'date-time', readOnly: true },
        end_time: { type: 'string', format: 'date-time', readOnly: true },
        calendar_id: { type: 'string', format: 'uuid', readOnly: true },
        raw: { type: 'object', additionalProperties: true, readOnly: true },
        platform: { type: 'string', readOnly: true },
        platform_id: { type: 'string', readOnly: true },
        ical_uid: { type: 'string', readOnly: true },
        meeting_platform: {
          readOnly: true,
          nullable: true,
          oneOf: [
            {
              enum: ['zoom', 'google_meet', 'microsoft_teams', 'webex'],
              type: 'string',
              description: '`zoom` `google_meet` `microsoft_teams` `webex`',
            },
            { enum: [null] },
          ],
        },
        meeting_url: { type: ['string', 'null'], readOnly: true },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
        updated_at: { type: 'string', format: 'date-time', readOnly: true },
        is_deleted: { type: 'boolean', readOnly: true },
      },
      required: [
        'calendar_id',
        'created_at',
        'end_time',
        'ical_uid',
        'id',
        'is_deleted',
        'meeting_platform',
        'meeting_url',
        'platform',
        'platform_id',
        'raw',
        'start_time',
        'updated_at',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarMeetingsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          ical_uid: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          start_time_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          start_time_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          override_should_record: { type: ['boolean', 'null'] },
          title: { type: 'string', readOnly: true },
          will_record: { type: 'boolean', readOnly: true },
          will_record_reason: { type: 'string', readOnly: true },
          start_time: { type: 'string', format: 'date-time', readOnly: true },
          end_time: { type: 'string', format: 'date-time', readOnly: true },
          platform: { type: 'string', readOnly: true },
          meeting_platform: { type: 'string', readOnly: true },
          calendar_platform: { type: 'string', readOnly: true },
          zoom_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_id', 'meeting_password'],
            properties: { meeting_id: { type: 'string' }, meeting_password: { type: 'string' } },
          },
          teams_invite: {
            readOnly: true,
            type: 'object',
            required: ['message_id', 'organizer_id', 'tenant_id', 'thread_id'],
            properties: {
              organizer_id: { type: 'string' },
              tenant_id: { type: 'string' },
              message_id: { type: 'string' },
              thread_id: { type: 'string' },
            },
          },
          meet_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_id'],
            properties: { meeting_id: { type: 'string' } },
          },
          webex_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_subdomain'],
            properties: {
              meeting_subdomain: { type: 'string' },
              meeting_path: {
                type: 'string',
                description: 'This value is available only for Scheduled Webex meetings.',
              },
              meeting_mtid: {
                type: 'string',
                description: 'This value is available only for Scheduled Webex meetings.',
              },
              meeting_personal_room_id: {
                type: 'string',
                description: 'This value is available only for Personal room Webex meetings.',
              },
            },
          },
          bot_id: { type: ['string', 'null'], format: 'uuid', readOnly: true },
          is_external: { type: 'boolean', readOnly: true },
          is_hosted_by_me: { type: 'boolean', readOnly: true },
          is_recurring: { type: 'boolean', readOnly: true },
          organizer_email: { type: 'string', readOnly: true },
          attendee_emails: { type: 'array', items: { type: 'string' }, readOnly: true },
          attendees: {
            type: 'array',
            items: { type: 'object', additionalProperties: true },
            readOnly: true,
          },
          ical_uid: { type: 'string', readOnly: true },
        },
        required: [
          'attendee_emails',
          'attendees',
          'bot_id',
          'calendar_platform',
          'end_time',
          'ical_uid',
          'id',
          'is_external',
          'is_hosted_by_me',
          'is_recurring',
          'meet_invite',
          'meeting_platform',
          'organizer_email',
          'platform',
          'start_time',
          'teams_invite',
          'title',
          'webex_invite',
          'will_record',
          'will_record_reason',
          'zoom_invite',
        ],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarMeetingsRefreshCreate = {
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          override_should_record: { type: ['boolean', 'null'] },
          title: { type: 'string', readOnly: true },
          will_record: { type: 'boolean', readOnly: true },
          will_record_reason: { type: 'string', readOnly: true },
          start_time: { type: 'string', format: 'date-time', readOnly: true },
          end_time: { type: 'string', format: 'date-time', readOnly: true },
          platform: { type: 'string', readOnly: true },
          meeting_platform: { type: 'string', readOnly: true },
          calendar_platform: { type: 'string', readOnly: true },
          zoom_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_id', 'meeting_password'],
            properties: { meeting_id: { type: 'string' }, meeting_password: { type: 'string' } },
          },
          teams_invite: {
            readOnly: true,
            type: 'object',
            required: ['message_id', 'organizer_id', 'tenant_id', 'thread_id'],
            properties: {
              organizer_id: { type: 'string' },
              tenant_id: { type: 'string' },
              message_id: { type: 'string' },
              thread_id: { type: 'string' },
            },
          },
          meet_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_id'],
            properties: { meeting_id: { type: 'string' } },
          },
          webex_invite: {
            readOnly: true,
            type: 'object',
            required: ['meeting_subdomain'],
            properties: {
              meeting_subdomain: { type: 'string' },
              meeting_path: {
                type: 'string',
                description: 'This value is available only for Scheduled Webex meetings.',
              },
              meeting_mtid: {
                type: 'string',
                description: 'This value is available only for Scheduled Webex meetings.',
              },
              meeting_personal_room_id: {
                type: 'string',
                description: 'This value is available only for Personal room Webex meetings.',
              },
            },
          },
          bot_id: { type: ['string', 'null'], format: 'uuid', readOnly: true },
          is_external: { type: 'boolean', readOnly: true },
          is_hosted_by_me: { type: 'boolean', readOnly: true },
          is_recurring: { type: 'boolean', readOnly: true },
          organizer_email: { type: 'string', readOnly: true },
          attendee_emails: { type: 'array', items: { type: 'string' }, readOnly: true },
          attendees: {
            type: 'array',
            items: { type: 'object', additionalProperties: true },
            readOnly: true,
          },
          ical_uid: { type: 'string', readOnly: true },
        },
        required: [
          'attendee_emails',
          'attendees',
          'bot_id',
          'calendar_platform',
          'end_time',
          'ical_uid',
          'id',
          'is_external',
          'is_hosted_by_me',
          'is_recurring',
          'meet_invite',
          'meeting_platform',
          'organizer_email',
          'platform',
          'start_time',
          'teams_invite',
          'title',
          'webex_invite',
          'will_record',
          'will_record_reason',
          'zoom_invite',
        ],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarMeetingsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar meeting.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        override_should_record: { type: ['boolean', 'null'] },
        title: { type: 'string', readOnly: true },
        will_record: { type: 'boolean', readOnly: true },
        will_record_reason: { type: 'string', readOnly: true },
        start_time: { type: 'string', format: 'date-time', readOnly: true },
        end_time: { type: 'string', format: 'date-time', readOnly: true },
        platform: { type: 'string', readOnly: true },
        meeting_platform: { type: 'string', readOnly: true },
        calendar_platform: { type: 'string', readOnly: true },
        zoom_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_id', 'meeting_password'],
          properties: { meeting_id: { type: 'string' }, meeting_password: { type: 'string' } },
        },
        teams_invite: {
          readOnly: true,
          type: 'object',
          required: ['message_id', 'organizer_id', 'tenant_id', 'thread_id'],
          properties: {
            organizer_id: { type: 'string' },
            tenant_id: { type: 'string' },
            message_id: { type: 'string' },
            thread_id: { type: 'string' },
          },
        },
        meet_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_id'],
          properties: { meeting_id: { type: 'string' } },
        },
        webex_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_subdomain'],
          properties: {
            meeting_subdomain: { type: 'string' },
            meeting_path: {
              type: 'string',
              description: 'This value is available only for Scheduled Webex meetings.',
            },
            meeting_mtid: {
              type: 'string',
              description: 'This value is available only for Scheduled Webex meetings.',
            },
            meeting_personal_room_id: {
              type: 'string',
              description: 'This value is available only for Personal room Webex meetings.',
            },
          },
        },
        bot_id: { type: ['string', 'null'], format: 'uuid', readOnly: true },
        is_external: { type: 'boolean', readOnly: true },
        is_hosted_by_me: { type: 'boolean', readOnly: true },
        is_recurring: { type: 'boolean', readOnly: true },
        organizer_email: { type: 'string', readOnly: true },
        attendee_emails: { type: 'array', items: { type: 'string' }, readOnly: true },
        attendees: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
          readOnly: true,
        },
        ical_uid: { type: 'string', readOnly: true },
      },
      required: [
        'attendee_emails',
        'attendees',
        'bot_id',
        'calendar_platform',
        'end_time',
        'ical_uid',
        'id',
        'is_external',
        'is_hosted_by_me',
        'is_recurring',
        'meet_invite',
        'meeting_platform',
        'organizer_email',
        'platform',
        'start_time',
        'teams_invite',
        'title',
        'webex_invite',
        'will_record',
        'will_record_reason',
        'zoom_invite',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarMeetingsUpdate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      override_should_record: { type: ['boolean', 'null'] },
      title: { type: 'string', readOnly: true },
      will_record: { type: 'boolean', readOnly: true },
      will_record_reason: { type: 'string', readOnly: true },
      start_time: { type: 'string', format: 'date-time', readOnly: true },
      end_time: { type: 'string', format: 'date-time', readOnly: true },
      platform: { type: 'string', readOnly: true },
      meeting_platform: { type: 'string', readOnly: true },
      calendar_platform: { type: 'string', readOnly: true },
      zoom_invite: {
        readOnly: true,
        type: 'object',
        required: ['meeting_id', 'meeting_password'],
        properties: { meeting_id: { type: 'string' }, meeting_password: { type: 'string' } },
      },
      teams_invite: {
        readOnly: true,
        type: 'object',
        required: ['message_id', 'organizer_id', 'tenant_id', 'thread_id'],
        properties: {
          organizer_id: { type: 'string' },
          tenant_id: { type: 'string' },
          message_id: { type: 'string' },
          thread_id: { type: 'string' },
        },
      },
      meet_invite: {
        readOnly: true,
        type: 'object',
        required: ['meeting_id'],
        properties: { meeting_id: { type: 'string' } },
      },
      webex_invite: {
        readOnly: true,
        type: 'object',
        required: ['meeting_subdomain'],
        properties: {
          meeting_subdomain: { type: 'string' },
          meeting_path: {
            type: 'string',
            description: 'This value is available only for Scheduled Webex meetings.',
          },
          meeting_mtid: {
            type: 'string',
            description: 'This value is available only for Scheduled Webex meetings.',
          },
          meeting_personal_room_id: {
            type: 'string',
            description: 'This value is available only for Personal room Webex meetings.',
          },
        },
      },
      bot_id: { type: ['string', 'null'], format: 'uuid', readOnly: true },
      is_external: { type: 'boolean', readOnly: true },
      is_hosted_by_me: { type: 'boolean', readOnly: true },
      is_recurring: { type: 'boolean', readOnly: true },
      organizer_email: { type: 'string', readOnly: true },
      attendee_emails: { type: 'array', items: { type: 'string' }, readOnly: true },
      attendees: {
        type: 'array',
        items: { type: 'object', additionalProperties: true },
        readOnly: true,
      },
      ical_uid: { type: 'string', readOnly: true },
    },
    required: [
      'attendee_emails',
      'attendees',
      'bot_id',
      'calendar_platform',
      'end_time',
      'ical_uid',
      'id',
      'is_external',
      'is_hosted_by_me',
      'is_recurring',
      'meet_invite',
      'meeting_platform',
      'organizer_email',
      'platform',
      'start_time',
      'teams_invite',
      'title',
      'webex_invite',
      'will_record',
      'will_record_reason',
      'zoom_invite',
    ],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar meeting.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        override_should_record: { type: ['boolean', 'null'] },
        title: { type: 'string', readOnly: true },
        will_record: { type: 'boolean', readOnly: true },
        will_record_reason: { type: 'string', readOnly: true },
        start_time: { type: 'string', format: 'date-time', readOnly: true },
        end_time: { type: 'string', format: 'date-time', readOnly: true },
        platform: { type: 'string', readOnly: true },
        meeting_platform: { type: 'string', readOnly: true },
        calendar_platform: { type: 'string', readOnly: true },
        zoom_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_id', 'meeting_password'],
          properties: { meeting_id: { type: 'string' }, meeting_password: { type: 'string' } },
        },
        teams_invite: {
          readOnly: true,
          type: 'object',
          required: ['message_id', 'organizer_id', 'tenant_id', 'thread_id'],
          properties: {
            organizer_id: { type: 'string' },
            tenant_id: { type: 'string' },
            message_id: { type: 'string' },
            thread_id: { type: 'string' },
          },
        },
        meet_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_id'],
          properties: { meeting_id: { type: 'string' } },
        },
        webex_invite: {
          readOnly: true,
          type: 'object',
          required: ['meeting_subdomain'],
          properties: {
            meeting_subdomain: { type: 'string' },
            meeting_path: {
              type: 'string',
              description: 'This value is available only for Scheduled Webex meetings.',
            },
            meeting_mtid: {
              type: 'string',
              description: 'This value is available only for Scheduled Webex meetings.',
            },
            meeting_personal_room_id: {
              type: 'string',
              description: 'This value is available only for Personal room Webex meetings.',
            },
          },
        },
        bot_id: { type: ['string', 'null'], format: 'uuid', readOnly: true },
        is_external: { type: 'boolean', readOnly: true },
        is_hosted_by_me: { type: 'boolean', readOnly: true },
        is_recurring: { type: 'boolean', readOnly: true },
        organizer_email: { type: 'string', readOnly: true },
        attendee_emails: { type: 'array', items: { type: 'string' }, readOnly: true },
        attendees: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
          readOnly: true,
        },
        ical_uid: { type: 'string', readOnly: true },
      },
      required: [
        'attendee_emails',
        'attendees',
        'bot_id',
        'calendar_platform',
        'end_time',
        'ical_uid',
        'id',
        'is_external',
        'is_hosted_by_me',
        'is_recurring',
        'meet_invite',
        'meeting_platform',
        'organizer_email',
        'platform',
        'start_time',
        'teams_invite',
        'title',
        'webex_invite',
        'will_record',
        'will_record_reason',
        'zoom_invite',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarUserRetrieve = {
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        external_id: { type: 'string' },
        connections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              connected: { type: 'boolean' },
              platform: { type: 'string' },
              email: { type: 'string' },
              id: { type: 'string' },
            },
            required: ['connected', 'platform'],
          },
          readOnly: true,
        },
        preferences: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', readOnly: true },
            record_non_host: { type: 'boolean' },
            record_recurring: { type: 'boolean' },
            record_external: { type: 'boolean' },
            record_internal: { type: 'boolean' },
            record_confirmed: { type: 'boolean' },
            record_only_host: { type: 'boolean' },
            bot_name: { type: 'string' },
          },
        },
      },
      required: ['connections', 'id'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarUserUpdate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      external_id: { type: 'string' },
      connections: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            connected: { type: 'boolean' },
            platform: { type: 'string' },
            email: { type: 'string' },
            id: { type: 'string' },
          },
          required: ['connected', 'platform'],
        },
        readOnly: true,
      },
      preferences: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          record_non_host: { type: 'boolean' },
          record_recurring: { type: 'boolean' },
          record_external: { type: 'boolean' },
          record_internal: { type: 'boolean' },
          record_confirmed: { type: 'boolean' },
          record_only_host: { type: 'boolean' },
          bot_name: { type: 'string' },
        },
      },
    },
    required: ['connections', 'id'],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        external_id: { type: 'string' },
        connections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              connected: { type: 'boolean' },
              platform: { type: 'string' },
              email: { type: 'string' },
              id: { type: 'string' },
            },
            required: ['connected', 'platform'],
          },
          readOnly: true,
        },
        preferences: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', readOnly: true },
            record_non_host: { type: 'boolean' },
            record_recurring: { type: 'boolean' },
            record_external: { type: 'boolean' },
            record_internal: { type: 'boolean' },
            record_confirmed: { type: 'boolean' },
            record_only_host: { type: 'boolean' },
            bot_name: { type: 'string' },
          },
        },
      },
      required: ['connections', 'id'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarUsersList = {
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          external_id: { type: 'string' },
          connections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                connected: { type: 'boolean' },
                platform: { type: 'string' },
                email: { type: 'string' },
                id: { type: 'string' },
              },
              required: ['connected', 'platform'],
            },
            readOnly: true,
          },
          preferences: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              record_non_host: { type: 'boolean' },
              record_recurring: { type: 'boolean' },
              record_external: { type: 'boolean' },
              record_internal: { type: 'boolean' },
              record_confirmed: { type: 'boolean' },
              record_only_host: { type: 'boolean' },
              bot_name: { type: 'string' },
            },
          },
        },
        required: ['connections', 'id'],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarsCreate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      oauth_client_id: { type: 'string', maxLength: 2000 },
      oauth_client_secret: { type: 'string', maxLength: 2000 },
      oauth_refresh_token: { type: 'string', maxLength: 2000 },
      platform: { enum: ['google_calendar', 'microsoft_outlook'], type: 'string' },
      webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
      oauth_email: { type: ['string', 'null'], readOnly: true },
      platform_email: { type: ['string', 'null'], readOnly: true },
      status: { type: 'string', readOnly: true },
      status_changes: { type: 'object', additionalProperties: true, readOnly: true },
      created_at: { type: 'string', format: 'date-time', readOnly: true },
      updated_at: { type: 'string', format: 'date-time', readOnly: true },
    },
    required: [
      'created_at',
      'id',
      'oauth_client_id',
      'oauth_client_secret',
      'oauth_email',
      'oauth_refresh_token',
      'platform',
      'platform_email',
      'status',
      'status_changes',
      'updated_at',
      'webhook_url',
    ],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        oauth_client_id: { type: 'string', maxLength: 2000 },
        oauth_client_secret: { type: 'string', maxLength: 2000 },
        oauth_refresh_token: { type: 'string', maxLength: 2000 },
        platform: {
          enum: ['google_calendar', 'microsoft_outlook'],
          type: 'string',
          description: '`google_calendar` `microsoft_outlook`',
        },
        webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
        oauth_email: { type: ['string', 'null'], readOnly: true },
        platform_email: { type: ['string', 'null'], readOnly: true },
        status: { type: 'string', readOnly: true },
        status_changes: { type: 'object', additionalProperties: true, readOnly: true },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
        updated_at: { type: 'string', format: 'date-time', readOnly: true },
      },
      required: [
        'created_at',
        'id',
        'oauth_client_id',
        'oauth_client_secret',
        'oauth_email',
        'oauth_refresh_token',
        'platform',
        'platform_email',
        'status',
        'status_changes',
        'updated_at',
        'webhook_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarsDestroy = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar.',
          },
        },
        required: ['id'],
      },
    ],
  },
} as const;
const CalendarsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          created_at__gte: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          cursor: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The pagination cursor value.',
          },
          ordering: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Which field to use when ordering the results.',
          },
          platform: {
            type: 'string',
            enum: ['google_calendar', 'microsoft_outlook'],
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          status: {
            type: 'string',
            enum: ['connected', 'connecting', 'disconnected'],
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        next: { type: ['string', 'null'] },
        previous: { type: ['string', 'null'] },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              oauth_client_id: { type: 'string', maxLength: 2000 },
              oauth_client_secret: { type: 'string', maxLength: 2000 },
              oauth_refresh_token: { type: 'string', maxLength: 2000 },
              platform: {
                enum: ['google_calendar', 'microsoft_outlook'],
                type: 'string',
                description: '`google_calendar` `microsoft_outlook`',
              },
              webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
              oauth_email: { type: ['string', 'null'], readOnly: true },
              platform_email: { type: ['string', 'null'], readOnly: true },
              status: { type: 'string', readOnly: true },
              status_changes: { type: 'object', additionalProperties: true, readOnly: true },
              created_at: { type: 'string', format: 'date-time', readOnly: true },
              updated_at: { type: 'string', format: 'date-time', readOnly: true },
            },
            required: [
              'created_at',
              'id',
              'oauth_client_id',
              'oauth_client_secret',
              'oauth_email',
              'oauth_refresh_token',
              'platform',
              'platform_email',
              'status',
              'status_changes',
              'updated_at',
              'webhook_url',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarsPartialUpdate = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', readOnly: true },
      oauth_client_id: { type: 'string', maxLength: 2000 },
      oauth_client_secret: { type: 'string', maxLength: 2000 },
      oauth_refresh_token: { type: 'string', maxLength: 2000 },
      platform: { enum: ['google_calendar', 'microsoft_outlook'], type: 'string' },
      webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
      oauth_email: { type: ['string', 'null'], readOnly: true },
      platform_email: { type: ['string', 'null'], readOnly: true },
      status: { type: 'string', readOnly: true },
      status_changes: { type: 'object', additionalProperties: true, readOnly: true },
      created_at: { type: 'string', format: 'date-time', readOnly: true },
      updated_at: { type: 'string', format: 'date-time', readOnly: true },
    },
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        oauth_client_id: { type: 'string', maxLength: 2000 },
        oauth_client_secret: { type: 'string', maxLength: 2000 },
        oauth_refresh_token: { type: 'string', maxLength: 2000 },
        platform: {
          enum: ['google_calendar', 'microsoft_outlook'],
          type: 'string',
          description: '`google_calendar` `microsoft_outlook`',
        },
        webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
        oauth_email: { type: ['string', 'null'], readOnly: true },
        platform_email: { type: ['string', 'null'], readOnly: true },
        status: { type: 'string', readOnly: true },
        status_changes: { type: 'object', additionalProperties: true, readOnly: true },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
        updated_at: { type: 'string', format: 'date-time', readOnly: true },
      },
      required: [
        'created_at',
        'id',
        'oauth_client_id',
        'oauth_client_secret',
        'oauth_email',
        'oauth_refresh_token',
        'platform',
        'platform_email',
        'status',
        'status_changes',
        'updated_at',
        'webhook_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CalendarsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this calendar.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        oauth_client_id: { type: 'string', maxLength: 2000 },
        oauth_client_secret: { type: 'string', maxLength: 2000 },
        oauth_refresh_token: { type: 'string', maxLength: 2000 },
        platform: {
          enum: ['google_calendar', 'microsoft_outlook'],
          type: 'string',
          description: '`google_calendar` `microsoft_outlook`',
        },
        webhook_url: { type: 'string', format: 'uri', maxLength: 2000 },
        oauth_email: { type: ['string', 'null'], readOnly: true },
        platform_email: { type: ['string', 'null'], readOnly: true },
        status: { type: 'string', readOnly: true },
        status_changes: { type: 'object', additionalProperties: true, readOnly: true },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
        updated_at: { type: 'string', format: 'date-time', readOnly: true },
      },
      required: [
        'created_at',
        'id',
        'oauth_client_id',
        'oauth_client_secret',
        'oauth_email',
        'oauth_refresh_token',
        'platform',
        'platform_email',
        'status',
        'status_changes',
        'updated_at',
        'webhook_url',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const ClipsCreate = {
  body: {
    type: 'object',
    properties: {
      bot_id: { type: 'string', format: 'uuid', writeOnly: true },
      start_timestamp: {
        type: 'number',
        format: 'double',
        minimum: 0,
        writeOnly: true,
        maximum: 1.7976931348623157e308,
      },
      end_timestamp: {
        type: 'number',
        format: 'double',
        minimum: 0,
        writeOnly: true,
        maximum: 1.7976931348623157e308,
      },
      id: { type: 'string', format: 'uuid', readOnly: true },
      video_url: { type: 'string', readOnly: true },
      image_url: { type: 'string', readOnly: true },
      created_at: { type: 'string', format: 'date-time' },
    },
    required: ['bot_id', 'end_timestamp', 'id', 'image_url', 'start_timestamp', 'video_url'],
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': {
      type: 'object',
      properties: {
        bot_id: { type: 'string', format: 'uuid', writeOnly: true },
        start_timestamp: {
          type: 'number',
          format: 'double',
          minimum: 0,
          writeOnly: true,
          maximum: 1.7976931348623157e308,
        },
        end_timestamp: {
          type: 'number',
          format: 'double',
          minimum: 0,
          writeOnly: true,
          maximum: 1.7976931348623157e308,
        },
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: { type: 'string', readOnly: true },
        image_url: { type: 'string', readOnly: true },
        created_at: { type: 'string', format: 'date-time' },
      },
      required: ['bot_id', 'end_timestamp', 'id', 'image_url', 'start_timestamp', 'video_url'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const ClipsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          created_at_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          created_at_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          cursor: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The pagination cursor value.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        next: { type: ['string', 'null'] },
        previous: { type: ['string', 'null'] },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bot_id: { type: 'string', format: 'uuid', writeOnly: true },
              start_timestamp: {
                type: 'number',
                format: 'double',
                minimum: 0,
                writeOnly: true,
                maximum: 1.7976931348623157e308,
              },
              end_timestamp: {
                type: 'number',
                format: 'double',
                minimum: 0,
                writeOnly: true,
                maximum: 1.7976931348623157e308,
              },
              id: { type: 'string', format: 'uuid', readOnly: true },
              video_url: { type: 'string', readOnly: true },
              image_url: { type: 'string', readOnly: true },
              created_at: { type: 'string', format: 'date-time' },
            },
            required: [
              'bot_id',
              'end_timestamp',
              'id',
              'image_url',
              'start_timestamp',
              'video_url',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const ClipsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this clip.',
          },
        },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        bot_id: { type: 'string', format: 'uuid', writeOnly: true },
        start_timestamp: {
          type: 'number',
          format: 'double',
          minimum: 0,
          writeOnly: true,
          maximum: 1.7976931348623157e308,
        },
        end_timestamp: {
          type: 'number',
          format: 'double',
          minimum: 0,
          writeOnly: true,
          maximum: 1.7976931348623157e308,
        },
        id: { type: 'string', format: 'uuid', readOnly: true },
        video_url: { type: 'string', readOnly: true },
        image_url: { type: 'string', readOnly: true },
        created_at: { type: 'string', format: 'date-time' },
      },
      required: ['bot_id', 'end_timestamp', 'id', 'image_url', 'start_timestamp', 'video_url'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const ClipsStatusList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A UUID string identifying this clip.',
          },
        },
        required: ['id'],
      },
      {
        type: 'object',
        properties: {
          created_at_after: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          created_at_before: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
          cursor: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The pagination cursor value.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        next: { type: ['string', 'null'] },
        previous: { type: ['string', 'null'] },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: {
                enum: ['submitted', 'progressing', 'complete', 'canceled', 'error'],
                type: 'string',
                description: '`submitted` `progressing` `complete` `canceled` `error`',
              },
            },
            required: ['status'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const RecordingsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: { id: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' } },
        required: ['id'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', readOnly: true },
        outputs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', readOnly: true },
              type: {
                enum: [
                  'raw_audio_unmixed',
                  'mp4_video_unmixed',
                  'active_speaker_diarized_transcription_assemblyai',
                  'active_speaker_diarized_transcription_awstranscribe',
                  'active_speaker_diarized_transcription_deepgram',
                  'active_speaker_diarized_transcription_rev',
                  'active_speaker_diarized_transcription_symbl',
                ],
                type: 'string',
                description:
                  '`raw_audio_unmixed` `mp4_video_unmixed` `active_speaker_diarized_transcription_assemblyai` `active_speaker_diarized_transcription_awstranscribe` `active_speaker_diarized_transcription_deepgram` `active_speaker_diarized_transcription_rev` `active_speaker_diarized_transcription_symbl`',
              },
              metadata: { type: 'object', additionalProperties: true },
              endpoints: { type: 'string', readOnly: true },
            },
            required: ['endpoints', 'id', 'type'],
          },
        },
        created_at: { type: 'string', format: 'date-time', readOnly: true },
        expires_at: { type: ['string', 'null'], format: 'date-time' },
      },
      required: ['created_at', 'id', 'outputs'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
export {
  AnalysisJobList,
  AnalysisJobRetrieve,
  BillingUsageRetrieve,
  BotAnalyzeCreate,
  BotCreate,
  BotDeleteMediaCreate,
  BotDestroy,
  BotIntelligenceRetrieve,
  BotLeaveCallCreate,
  BotList,
  BotPartialUpdate,
  BotRetrieve,
  BotScreenshotsList,
  BotScreenshotsRetrieve,
  BotSendChatMessageCreate,
  BotSpeakerTimelineList,
  BotTranscribeCreate,
  BotTranscriptList,
  CalendarAccountsAccessTokenRetrieve,
  CalendarAccountsRetrieve,
  CalendarAuthenticateCreate,
  CalendarEventsList,
  CalendarEventsRetrieve,
  CalendarMeetingsList,
  CalendarMeetingsRefreshCreate,
  CalendarMeetingsRetrieve,
  CalendarMeetingsUpdate,
  CalendarUserRetrieve,
  CalendarUserUpdate,
  CalendarUsersList,
  CalendarsCreate,
  CalendarsDestroy,
  CalendarsList,
  CalendarsPartialUpdate,
  CalendarsRetrieve,
  ClipsCreate,
  ClipsList,
  ClipsRetrieve,
  ClipsStatusList,
  RecordingsRetrieve,
};
