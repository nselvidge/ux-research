import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Progress,
  Text,
  Icon,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React, { ChangeEvent, useMemo, useState } from "react";
import * as UpChunk from "@mux/upchunk";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone, FileRejection } from "react-dropzone";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { useCreateUploadUrlMutation } from "../requests/upload.generated";
import { FaVideo } from "react-icons/fa";
import { useLocation } from "wouter";
import { trackEvent } from "~/domains/analytics/tracker";

const uploadUrl = "/video/upload";

// max size of 3GB
const MAX_FILE_SIZE = 1000 * 1000 * 1000 * 3;
const SUPPORTED_FILES: { [mimeType: string]: string[] } = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/mov": [".mov"],
  "video/avi": [".avi"],
  "video/mpeg": [".mpeg"],
  "video/wmv": [".wmv"],
};

const supportedFileExtensions = Object.values(SUPPORTED_FILES).flat();

export const VideoUpload = () => {
  const [interviewName, setInterviewName] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const { currentWorkspace } = useCurrentWorkspace();
  const [progress, setProgress] = useState(0);
  const [createUploadUrl] = useCreateUploadUrlMutation();
  const [_, navigate] = useLocation();

  const changeHandler = (files: File[], fileRejections: FileRejection[]) => {
    const file = files[0];

    if (fileRejections.length > 0) {
      const [rejection] = fileRejections;

      if (rejection.errors.length > 0) {
        const [error] = rejection.errors;

        if (error.code === "file-invalid-type") {
          return setCustomError(
            `Unsupported file type. Supported file types: ${supportedFileExtensions.join(
              ", "
            )}`
          );
        }

        if (error.code === "file-too-large") {
          return setCustomError(
            `File is too large. Max file size: ${
              MAX_FILE_SIZE / 1000 / 1000 / 1000
            }GB`
          );
        }

        if (error.code === "too-many-files") {
          return setCustomError(
            `Too many files. Only one file can be uploaded at a time.`
          );
        }
      }
      return setCustomError("An unkwown error occurred, please try again.");
    }
    setCustomError(null);

    setSelectedFile(file);

    setInterviewName(file.name.split(".")[0]);

    setDate(new Date(file.lastModified));
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: changeHandler,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: SUPPORTED_FILES,
  });

  const handleSubmission = async () => {
    if (!selectedFile) {
      setCustomError("No file selected");
      return;
    }

    if (!interviewName) {
      setCustomError(
        "No interview name, please enter a name for the interview"
      );
      return;
    }

    if (!date) {
      setCustomError(
        "No interview date, please enter a date for the interview"
      );
      return;
    }
    setProgress(1);

    const result = await createUploadUrl({
      variables: {
        workspaceId: currentWorkspace,
        interviewName,
        interviewDate: date,
      },
    });

    const url = result.data?.createUploadUrl?.uploadUrl;
    const interviewId = result.data?.createUploadUrl?.interviewId;

    if (!url) {
      setCustomError("Failed to create an upload");
      return;
    }

    const upload = UpChunk.createUpload({
      endpoint: url,
      file: selectedFile,
    });

    upload.on("error", (err) => {
      setCustomError(err.detail);
    });

    upload.on("progress", (progress) => {
      setProgress(progress.detail);
    });

    upload.on("success", () => {
      trackEvent("Interview Imported", {
        importType: "upload",
      });
      navigate("/interview/" + interviewId);
    });
  };

  return (
    <Flex
      padding="24px"
      borderRadius="16px"
      direction="column"
      flexGrow={0}
      background="white"
      width="100%"
    >
      <Heading variant="titleBold" marginBottom="4px">
        🎥 Import an interview
      </Heading>
      <Text variant="body" marginBottom="24px">
        Import past interviews to add them to your workspace. You can then
        capture highlights, create a summary and more.
      </Text>
      {customError && (
        <Alert status="error" marginBottom="24px">
          <AlertIcon />
          <AlertTitle mr={2}>{customError}</AlertTitle>
        </Alert>
      )}
      {!selectedFile ? (
        <>
          <Flex
            {...getRootProps()}
            width="100%"
            height="300px"
            alignItems="center"
            justifyContent="center"
            border="2px dashed #DBDBDB"
            direction="column"
            backgroundColor="#F7F7F7"
            borderRadius="16px"
            marginBottom="20px"
          >
            <input {...getInputProps()} />
            <Text>👇</Text>
            <Text variant="bodyBold">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop a video file here"}
            </Text>
            <Text>{supportedFileExtensions.join(", ")}</Text>
            <Text>Max file size: {MAX_FILE_SIZE / 1000 / 1000 / 1000}GB</Text>
          </Flex>
          <Flex justifyContent="end">
            <Button width="auto" variant="brandMono" onClick={open}>
              Select from your computer
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Flex marginBottom="20px">
            <Flex
              alignItems="center"
              justifyContent="center"
              background="#F7F7F7"
              width="182px"
              height="104px"
              borderRadius="16px"
              marginRight="16px"
              position="relative"
            >
              <Icon color="black" size="16px" as={FaVideo} />

              {progress > 0 && progress < 100 && (
                <Progress
                  position="absolute"
                  left="8px"
                  right="8px"
                  bottom="15px"
                  colorScheme="green"
                  hasStripe
                  value={progress}
                />
              )}
            </Flex>
            <Flex direction="column" justifyContent="space-between">
              <FormControl>
                <Input
                  name="interviewName"
                  placeholder="Interview With John Doe"
                  value={interviewName}
                  onChange={(e) => setInterviewName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  name="interviewDate"
                  selected={date}
                  as={DatePicker}
                  maxDate={new Date()}
                  onChange={(date: any) => {
                    setDate(date);
                  }}
                />
              </FormControl>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Button
              variant="brandMono"
              onClick={() => {
                setInterviewName("");
                setDate(null);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="brand" onClick={handleSubmission}>
              Upload
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};
