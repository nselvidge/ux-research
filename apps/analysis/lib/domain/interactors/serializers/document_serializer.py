"""
functions to serialize and deserialize documents for communication with
external systems
"""
from typing import NamedTuple, List, Optional
from lib.domain.entities.interview_document import \
    InterviewDocument
from lib.domain.interactors.serializers.extracted_quote_serializer import \
    GatewayExtractedQuote, create_gateway_extracted_quote


class GatewayInterviewDocument(NamedTuple):
    """
    Gateway document
    represents a document that is transmitted externally.
    """
    text: str
    summary: Optional[str]
    extracted_quotes: List[GatewayExtractedQuote]


def deserialize_document(text: str) -> InterviewDocument:
    """Deserialize a document"""
    return InterviewDocument(
        text=text,
        summary=None,
        extracted_quotes=[],
    )


def create_gateway_document(document):
    """Create a gateway document"""
    return GatewayInterviewDocument(
        text=document.text,
        summary=document.summary,
        extracted_quotes=[create_gateway_extracted_quote(quote)
                          for quote in document.extracted_quotes],
    )
