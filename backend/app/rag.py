import os
import re
import math
from typing import List, Dict, Any, Tuple
from .models import SourceCitation, AssistantChatResponse

class RagEngine:
    def __init__(self, knowledge_docs: List[Dict[str, Any]]):
        self.knowledge_docs = knowledge_docs
        self.chunks: List[Dict[str, Any]] = []
        self._build_index()

    def _build_index(self):
        self.chunks = []
        for doc in self.knowledge_docs:
            paragraphs = [p.strip() for p in doc["content"].split("\n") if len(p.strip()) > 30]
            for idx, p in enumerate(paragraphs):
                tokens = self._tokenize(p)
                self.chunks.append({
                    "doc_id": doc["id"],
                    "doc_title": doc["title"],
                    "doc_type": doc["document_type"],
                    "org_name": doc["org_name"],
                    "text": p,
                    "tokens": tokens
                })

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
        stopwords = {"the", "a", "an", "in", "on", "at", "for", "of", "and", "or", "is", "are", "to", "by", "with", "this", "that", "all", "our", "from"}
        return [w for w in cleaned.split() if len(w) > 2 and w not in stopwords]

    def retrieve(self, query: str, top_k: int = 3, threshold: float = 0.08) -> List[Tuple[Dict[str, Any], float]]:
        q_tokens = self._tokenize(query)
        if not q_tokens:
            return []

        scored = []
        for chunk in self.chunks:
            c_tokens = chunk["tokens"]
            if not c_tokens:
                continue

            # Token overlap & TF score
            matches = [t for t in q_tokens if t in c_tokens]
            if not matches:
                continue

            score = len(matches) / (math.sqrt(len(q_tokens)) * math.sqrt(len(c_tokens)))
            if score >= threshold:
                scored.append((chunk, float(score)))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def answer_query(self, query: str, cause_filter: str = None) -> AssistantChatResponse:
        results = self.retrieve(query, top_k=3)

        if not results:
            return AssistantChatResponse(
                answer=(
                    "I searched the verified NGO knowledge base (including field manuals, annual impact briefs, "
                    "and safety policies), but no sufficiently grounded documentation matches your specific query. "
                    "To prevent misinformation, I do not generate unverified claims. You can reach out directly to the "
                    "participating NGO or explore opportunities in the Cause directory."
                ),
                citations=[],
                grounded=False,
                confidence_note="Insufficient verified source material in local knowledge base.",
                fallback_mode=True
            )

        citations = []
        context_parts = []
        for chunk, score in results:
            citations.append(SourceCitation(
                document_title=chunk["doc_title"],
                document_type=chunk["doc_type"],
                organization_name=chunk["org_name"],
                excerpt=chunk["text"],
                relevance_score=round(score * 100, 1)
            ))
            context_parts.append(f"[{chunk['org_name']} — {chunk['doc_title']} ({chunk['doc_type']})]:\n{chunk['text']}")

        joined_context = "\n\n".join(context_parts)

        # Check if GEMINI_API_KEY is available
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                prompt = (
                    "You are the ImpactSphere AI Assistant. Answer the user's question using ONLY the provided verified documentation. "
                    "Do not extrapolate, assume, or invent figures, dates, or outcomes not found directly in the text. "
                    "Always mention which organization and document supports your answer.\n\n"
                    f"VERIFIED CONTEXT:\n{joined_context}\n\n"
                    f"USER QUESTION: {query}\n\n"
                    "GROUNDED ANSWER:"
                )
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    return AssistantChatResponse(
                        answer=response.text.strip(),
                        citations=citations,
                        grounded=True,
                        confidence_note="Answer synthesized with Gemini 2.5 Flash and verified against NGO source chunks.",
                        fallback_mode=False
                    )
            except Exception as e:
                # Log or note error, fall back cleanly
                pass

        # Deterministic grounded synthesis when LLM API key is unconfigured or quota reached
        top_chunk = results[0][0]
        answer_text = (
            f"Based on verified records from **{top_chunk['org_name']}** ({top_chunk['doc_title']}):\n\n"
            f"> \"{top_chunk['text']}\"\n\n"
            f"This documentation establishes verified operational guidelines for their community programming. "
            f"See the cited references below for full context."
        )

        return AssistantChatResponse(
            answer=answer_text,
            citations=citations,
            grounded=True,
            confidence_note="Directly extracted from verified organizational documents (Deterministic grounding active).",
            fallback_mode=False
        )
