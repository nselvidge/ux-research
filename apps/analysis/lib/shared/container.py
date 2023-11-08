"""Dependency injection container"""
from dependency_injector import containers, providers
from lib.domain.services.langchain_document_summarization_service import\
    LangchainDocumentSummarizationService


class Container(containers.DeclarativeContainer):
    """Container for dependency injection"""

    wiring_config = containers.WiringConfiguration(
        packages=['lib.domain']
    )

    summarization_service = providers.Factory(
        LangchainDocumentSummarizationService)
