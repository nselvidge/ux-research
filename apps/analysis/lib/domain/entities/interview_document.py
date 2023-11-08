"""Document entity class"""
from typing import List, Optional, NamedTuple
from lib.domain.entities.extracted_quote import ExtractedQuote


class ExtractedQuoteMessage(NamedTuple):
    quote: str
    tag_name: str


class TagDescription(NamedTuple):
    id: str
    name: str
    description: str


class InterviewDocument:
    """
    Document entity class
    This entity represents a document. Documents contain sentences which
    are combined to form segments.
    """
    extracted_quotes = []  # type: List[ExtractedQuote]
    summary = None  # type: Optional[str]

    def __init__(self, text: str, summary: Optional[str],
                 extracted_quotes: List[ExtractedQuote] = []) -> None:
        self.text = text
        self.summary = summary
        self.extracted_quotes = extracted_quotes

    def set_summary(self, summary: str) -> str:
        """Summarize the document"""
        self.summary = summary

    def add_extracted_quotes(self,
                             extracted_quotes: List[ExtractedQuoteMessage],
                             tags: List[TagDescription]) -> None:
        """Add extracted quotes to the document"""
        tag_dict = {tag.name: tag for tag in tags}

        # validate that all tags are valid
        for quote in extracted_quotes:
            if quote.tag_name not in tag_dict:
                raise ValueError("Invalid tag name: {}".format(quote.tag_name))

        self.extracted_quotes = [ExtractedQuote(quote=quote.quote,
                                 tag=tag_dict[quote.tag_name].id)
                                 for quote in extracted_quotes]
