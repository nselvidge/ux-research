"""
Interactor responsible for managing operations related to reading documents.
"""
from typing import NamedTuple, List
from abc import abstractmethod, ABC
from lib.domain.interactors.serializers.document_serializer import \
    GatewayInterviewDocument, deserialize_document, create_gateway_document


class TagDescriptionMessage(NamedTuple):
    id: str
    name: str
    description: str


class ExtractedQuoteMessage(NamedTuple):
    quote: str
    tag: str


class ISummarizationService(ABC):
    """Segmentation service interface"""

    @abstractmethod
    def summarize_interview(self, text: str) -> str:
        """Summarize a document"""
        raise NotImplementedError

    @abstractmethod
    def extract_quotes(self, text: str,
                       tag_descriptions: List[TagDescriptionMessage]) -> str:
        """Extract quotes from a document"""
        raise NotImplementedError


class ReaderInteractor:
    """
    Interactor responsible for managing operations related to reading
    documents.
    """

    def __init__(self, summarization_service: ISummarizationService):
        self.summarization_service = summarization_service

    def extract_quotes(self, text: str,
                       tags_descriptions: List[TagDescriptionMessage]):
        """
        Extract quotes from a document
        This method will extract quotes from a document by finding the
        most important sentences.

        :param document: Document to extract quotes from
        :return: List of sentences
        """
        document = deserialize_document(text)

        quotes = self.summarization_service.extract_quotes(
            document.text, tags_descriptions)

        document.add_extracted_quotes(quotes, tags_descriptions)

        return create_gateway_document(document).extracted_quotes

    def summarize_interview(self, gateway_document: GatewayInterviewDocument):
        """
        Summarize a document
        This method will summarize a document by extracting the most
        important sentences.

        :param document: Document to summarize
        :return: List of sentences
        """
        document = deserialize_document(gateway_document.text)

        summary = self.summarization_service.summarize_interview(document.text)
        document.set_summary(summary)

        return create_gateway_document(document).summary
