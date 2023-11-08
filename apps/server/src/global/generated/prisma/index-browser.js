
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.9.0
 * Query Engine version: ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5
 */
Prisma.prismaVersion = {
  client: "4.9.0",
  engine: "ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.EditableAssetScalarFieldEnum = makeEnum({
  id: 'id',
  videoId: 'videoId',
  status: 'status',
  playbackId: 'playbackId',
  isSigned: 'isSigned',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ExternalAuthScalarFieldEnum = makeEnum({
  userId: 'userId',
  type: 'type',
  authToken: 'authToken',
  refreshToken: 'refreshToken',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.HighlightScalarFieldEnum = makeEnum({
  id: 'id',
  highlightedRangeId: 'highlightedRangeId',
  timestamp: 'timestamp',
  interviewId: 'interviewId',
  videoId: 'videoId',
  transcriptId: 'transcriptId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  originSuggestionId: 'originSuggestionId'
});

exports.Prisma.IdentityScalarFieldEnum = makeEnum({
  token: 'token',
  userId: 'userId',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.InterviewScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  recordingId: 'recordingId',
  workspaceId: 'workspaceId',
  creatorId: 'creatorId',
  archived: 'archived',
  date: 'date',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  recordingError: 'recordingError',
  projectId: 'projectId'
});

exports.Prisma.InterviewSourceScalarFieldEnum = makeEnum({
  id: 'id',
  sourceId: 'sourceId',
  platform: 'platform',
  interviewId: 'interviewId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.InterviewSummaryScalarFieldEnum = makeEnum({
  id: 'id',
  text: 'text',
  generatedText: 'generatedText',
  touched: 'touched',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  interviewId: 'interviewId'
});

exports.Prisma.NotificationPreferencesScalarFieldEnum = makeEnum({
  id: 'id',
  userId: 'userId',
  notificationEmails: 'notificationEmails',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ParticipantScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name'
});

exports.Prisma.PlayableAssetScalarFieldEnum = makeEnum({
  id: 'id',
  videoId: 'videoId',
  platform: 'platform',
  isSigned: 'isSigned',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ProjectScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  workspaceId: 'workspaceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ProjectTagsScalarFieldEnum = makeEnum({
  id: 'id',
  projectId: 'projectId',
  tagId: 'tagId',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.RecorderScalarFieldEnum = makeEnum({
  id: 'id',
  externalId: 'externalId',
  error: 'error',
  type: 'type',
  targetId: 'targetId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  status: 'status'
});

exports.Prisma.RecordingTargetScalarFieldEnum = makeEnum({
  id: 'id',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.SessionScalarFieldEnum = makeEnum({
  id: 'id',
  session: 'session',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.SuggestedHighlightScalarFieldEnum = makeEnum({
  id: 'id',
  highlightedRangeId: 'highlightedRangeId',
  interviewId: 'interviewId',
  transcriptId: 'transcriptId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.TagScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  color: 'color',
  workspaceId: 'workspaceId',
  autoExtract: 'autoExtract',
  description: 'description',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  emoji: 'emoji'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TranscriptGroupScalarFieldEnum = makeEnum({
  text: 'text',
  transcriptId: 'transcriptId',
  groupNumber: 'groupNumber',
  speakerId: 'speakerId'
});

exports.Prisma.TranscriptScalarFieldEnum = makeEnum({
  id: 'id',
  version: 'version',
  interviewId: 'interviewId',
  isPending: 'isPending',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.TranscriptWordScalarFieldEnum = makeEnum({
  transcriptId: 'transcriptId',
  groupNumber: 'groupNumber',
  wordNumber: 'wordNumber',
  start: 'start',
  end: 'end',
  text: 'text'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  email: 'email',
  emailHash: 'emailHash',
  fullName: 'fullName',
  confirmed: 'confirmed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.UserTagOrderScalarFieldEnum = makeEnum({
  id: 'id',
  userId: 'userId',
  tagId: 'tagId',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.VideoScalarFieldEnum = makeEnum({
  id: 'id',
  startTime: 'startTime',
  recorderId: 'recorderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.WordRangeScalarFieldEnum = makeEnum({
  id: 'id',
  transcriptId: 'transcriptId',
  startWordNumber: 'startWordNumber',
  startGroupNumber: 'startGroupNumber',
  endWordNumber: 'endWordNumber',
  endGroupNumber: 'endGroupNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.WorkspaceInviteScalarFieldEnum = makeEnum({
  token: 'token',
  workspaceId: 'workspaceId',
  inviterId: 'inviterId',
  isExpired: 'isExpired',
  inviteeEmail: 'inviteeEmail',
  isAccepted: 'isAccepted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.WorkspaceRoleScalarFieldEnum = makeEnum({
  userId: 'userId',
  workspaceId: 'workspaceId',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.WorkspaceScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  publicInterviewLinks: 'publicInterviewLinks',
  ownedDomain: 'ownedDomain',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
exports.EditableAssetStatus = makeEnum({
  processing: 'processing',
  completed: 'completed'
});

exports.ExternalAuthTypes = makeEnum({
  zoom: 'zoom',
  zoomV2: 'zoomV2'
});

exports.IdentityType = makeEnum({
  password: 'password',
  zoom: 'zoom'
});

exports.InterviewSourcePlatforms = makeEnum({
  zoom: 'zoom',
  zoomV2: 'zoomV2',
  upload: 'upload',
  recall: 'recall'
});

exports.RecorderStatus = makeEnum({
  pending: 'pending',
  recording: 'recording',
  done: 'done'
});

exports.RecorderType = makeEnum({
  recall: 'recall'
});

exports.RecordingTargetType = makeEnum({
  zoom: 'zoom',
  zoomV2: 'zoomV2'
});

exports.RoleType = makeEnum({
  admin: 'admin',
  member: 'member'
});

exports.StoragePlatforms = makeEnum({
  s3: 's3',
  local: 'local',
  mux: 'mux'
});

exports.SuggestedHighlightStatus = makeEnum({
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
});

exports.TagColor = makeEnum({
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  indigo: 'indigo',
  sky: 'sky',
  purple: 'purple'
});

exports.Prisma.ModelName = makeEnum({
  InterviewSummary: 'InterviewSummary',
  InterviewSource: 'InterviewSource',
  Interview: 'Interview',
  Video: 'Video',
  EditableAsset: 'EditableAsset',
  PlayableAsset: 'PlayableAsset',
  Transcript: 'Transcript',
  TranscriptGroup: 'TranscriptGroup',
  TranscriptWord: 'TranscriptWord',
  WordRange: 'WordRange',
  Highlight: 'Highlight',
  Session: 'Session',
  User: 'User',
  Identity: 'Identity',
  ExternalAuth: 'ExternalAuth',
  Workspace: 'Workspace',
  WorkspaceInvite: 'WorkspaceInvite',
  WorkspaceRole: 'WorkspaceRole',
  Participant: 'Participant',
  Tag: 'Tag',
  NotificationPreferences: 'NotificationPreferences',
  UserTagOrder: 'UserTagOrder',
  SuggestedHighlight: 'SuggestedHighlight',
  Project: 'Project',
  ProjectTags: 'ProjectTags',
  Recorder: 'Recorder',
  RecordingTarget: 'RecordingTarget'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
