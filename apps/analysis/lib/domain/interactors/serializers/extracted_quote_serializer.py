from typing import NamedTuple
from lib.domain.entities.extracted_quote import ExtractedQuote


class GatewayExtractedQuote(NamedTuple):
    """Extracted quote for returing to the gateway"""
    quote: str
    tag: str


def create_gateway_extracted_quote(quote: ExtractedQuote) -> \
        GatewayExtractedQuote:
    """Serialize an extracted quote"""
    return GatewayExtractedQuote(
        quote=quote.quote,
        tag=quote.tag,
    )


def deserialize_extracted_quote(quote: GatewayExtractedQuote) -> \
        ExtractedQuote:
    """Deserialize an extracted quote"""
    return ExtractedQuote(
        quote=quote.quote,
        tag=quote.tag,
    )
