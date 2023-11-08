"""Langchain based document summarization service"""
import re
from typing import List
from langchain.chains.summarize import load_summarize_chain
from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    HumanMessage
)
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate

from lib.domain.interactors.reader import ISummarizationService, \
    TagDescriptionMessage
from lib.domain.entities.interview_document import ExtractedQuoteMessage

initial_summary_prompt = """
The following is a transcript of an interview, where {interviewee} is being
interviewed. Your job is to create a summary that captures the key takeaways,
pain points, opinions, feature requests, needs and wants of {interviewee}. Do
not include any of the interviewer's questions or responses.

---

{text}

---

Summary of what {interviewee} said:"""

refine_summary_prompt = """
The following is a transcript of an interview, where {interviewee} is being
interviewed. Your job is to create a summary that captures the key takeaways,
pain points, opinions, feature requests, needs and wants of {interviewee}.
Do not include any of the interviewer's questions or responses.

We have provided an existing summary up to a certain point:

----
{existing_answer}
---

We have the opportunity to refine the existing summary
(only if needed) with some more context below.
Make sure to focus on the responses from the interviewee, {interviewee}.
------------
{text}
------------
Given the new context, refine the original summary
If the context isn't useful, return the original summary.
Updated summary:"""

extract_interviewee_prompt = """
The following is part of a user interview transcript. A member of the
interview team is interviewing a user to learn about their experience
with the product. Your job is to identify the name of the person being
interviewed. If the name is not available, speakers will be labeled with a
letter like 'A' or 'B'. Use the letter to identify the speaker. if you are not
sure, choose your best guess.

---begin transcript---

{text}

---end transcript---

Interviewee name:"""

extract_highlight_map_prompt = """
The following is part of a user interview transcript. {interviewee} is being
interviewed. The transcript is in the following format:

<speaker>: <sentence>

Your job is to extract the most valuable highlights from the transcript in the
form of exact quotes. The quotes should also be labeled with one of the
following tags:

{tag_descriptions}

Only include a quote if it closely matches one of the tags. Each quote should
only have one tag. Make sure the quote includes a few additional sentences of
context. Each quote should be a few sentences long. If there are no quotes
that match any of the tags then output 'N/A'. output quotes in the following
format:

- <tag>: '<exact quote from transcript>'

---begin transcript---

{text}

---end transcript---

Exact quotes:"""

extract_highlight_combine_prompt = """
The following is a list of quotes. Combine them into a single list, but keep
the content exactly the same. Remove any duplicates and any 'N/A' responses.
If there are no quotes then output 'No highlights'. use the following format:

- <tag>: '<exact quote from transcript>'

List of quotes:

{text}

Combined list of quotes:"""


class LangchainDocumentSummarizationService(ISummarizationService):
    """Langchain document summarization service"""

    def generate_overall_summary(self, text: str) -> str:
        llm = ChatOpenAI(model_name="gpt-4",
                         temperature=0.5, request_timeout=300)

        interviewee = self.extract_interviewee(text)
        initial_prompt, refine_prompt = self.create_overall_summary_prompt(
            interviewee)

        text_splitter = CharacterTextSplitter\
            .from_tiktoken_encoder(separator=".",
                                   chunk_size=3000, chunk_overlap=150)

        summarization_chain = load_summarize_chain(
            llm,
            "refine",
            question_prompt=initial_prompt,
            refine_prompt=refine_prompt,
        )

        texts = text_splitter.split_text(text)
        docs = [Document(page_content=text) for text in texts]

        result = summarization_chain(docs)

        return result['output_text']

    def summarize_interview(self, text: str) -> str:
        """Summarize a document"""

        return self.generate_overall_summary(text)

    def extract_interviewee(self, text: str) -> str:
        """Extract the interviewee from a document"""
        llm = ChatOpenAI(model_name="gpt-3.5-turbo",
                         temperature=0.5, request_timeout=300)
        text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
            separator=".", chunk_size=3000, chunk_overlap=150)
        texts = text_splitter.split_text(text)
        first_section = texts[0]

        prompt = (extract_interviewee_prompt.format(text=first_section))

        return llm([HumanMessage(content=prompt)]).content.strip()

    def create_overall_summary_prompt(self, interviewee: str) -> tuple[
            PromptTemplate, PromptTemplate]:
        """Create a prompt template"""

        initial_prompt = PromptTemplate(template=initial_summary_prompt.format(
            interviewee=interviewee, text="{text}"),
            input_variables=["text"]
        )

        refine_prompt = PromptTemplate(
            template=refine_summary_prompt.format(
                interviewee=interviewee,
                text="{text}",
                existing_answer="{existing_answer}"),
            input_variables=["text", "existing_answer"])

        return initial_prompt, refine_prompt

    def extract_quotes(self, text: str,
                       tag_descriptions: List[TagDescriptionMessage]) -> str:
        """Extract quotes from a document"""
        llm = ChatOpenAI(model_name="gpt-4",
                         temperature=0.5, request_timeout=300)

        interviewee = self.extract_interviewee(text)
        map_prompt = extract_highlight_map_prompt.format(
            interviewee=interviewee,
            text="{text}",
            tag_descriptions="\n".join(
                [f"- {tag.name}: {tag.description}" for tag
                 in tag_descriptions]
            )
        )

        map_template = PromptTemplate(
            template=map_prompt,
            input_variables=["text"]
        )

        combine_template = PromptTemplate(
            template=extract_highlight_combine_prompt,
            input_variables=["text"]
        )

        text_splitter = CharacterTextSplitter\
            .from_tiktoken_encoder(separator=".",
                                   chunk_size=3000, chunk_overlap=150)

        summarization_chain = load_summarize_chain(
            llm,
            "map_reduce",
            map_prompt=map_template,
            combine_prompt=combine_template,
        )

        texts = text_splitter.split_text(text)
        docs = [Document(page_content=text) for text in texts]

        result = summarization_chain(docs)

        text_result = result['output_text']  # type: str

        if text_result == "No highlights":
            return []

        tuple_list = [line
                      .strip(' -\n')
                      .replace("'", '')
                      .replace('"', '')
                      .split(': ', 1)
                      for line in text_result.splitlines()
                      # Ensure that the line is a tag and quote
                      if re.search("^-.+:.+", line.strip(' \n'))]

        return [ExtractedQuoteMessage(tag_name=tag, quote=quote) for
                tag, quote in tuple_list]
